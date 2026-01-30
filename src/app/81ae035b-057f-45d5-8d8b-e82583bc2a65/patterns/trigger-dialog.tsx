"use client";

import { useEffect, useRef, useState } from "react";

import { ArrowLeft, CheckIcon, ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, EyeIcon, InfoIcon, PlusIcon, TrashIcon, X, ZoomIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/81ae035b-057f-45d5-8d8b-e82583bc2a65/components/dialog";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Condition, Props as TriggerConditionProps } from "@/app/81ae035b-057f-45d5-8d8b-e82583bc2a65/components/condition";
import { Condition as ConditionPreview, ConditionProps as ConditionPreviewProps } from "@/app/81ae035b-057f-45d5-8d8b-e82583bc2a65/components/conditions";

interface TableProps {
    name: string;
}

interface TableUpdateProps {
    condition?: "all-updated" | "any-updated";
    names: TableProps[];
}

type Days = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type TriggerType = "continuous" | "file-arrival" | "schedule" | "table-update";

// Base interface for common properties
interface BaseTriggerProps {
    id?: string;
    status?: boolean;
    conditions?: TriggerConditionProps[];
    activation?: {
        days: Days[];
        endTime: string;
        startTime: string;
        timezone: string;
    };
}

// Schedule-specific trigger
interface ScheduleTriggerProps extends BaseTriggerProps {
    type: "schedule";
    scheduleMode?: "interval" | "cron";
    interval?: number;
    timeUnit?: string;
    cronExpression?: string;
    timezone?: string;
    time?: string;
}

// Continuous-specific trigger
interface ContinuousTriggerProps extends BaseTriggerProps {
    type: "continuous";
    taskRetryMode?: "on-failure" | "never";
}

// File arrival-specific trigger
interface FileArrivalTriggerProps extends BaseTriggerProps {
    type: "file-arrival";
    storageLocation?: string;
    minTimeBetweenTriggers?: number; // in seconds
    waitAfterLastChange?: number; // in seconds
}

// Table update-specific trigger
interface TableUpdateTriggerProps extends BaseTriggerProps {
    type: "table-update";
    tableUpdate?: TableUpdateProps;
    minTimeBetweenTriggers?: number; // in seconds
    waitAfterLastChange?: number; // in seconds
}

// Union type
export type TriggerProps = ScheduleTriggerProps | ContinuousTriggerProps | FileArrivalTriggerProps | TableUpdateTriggerProps;

// Helper functions for duration formatting
function secondsToTimeString(seconds: number | undefined): string {
    if (!seconds) return "00h 00m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
}

function parseTimeString(timeString: string): number {
    const match = timeString.match(/(\d+)h\s*(\d+)m/);
    if (!match) return 0;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 3600 + minutes * 60;
}

const exampleSQLTriggers: ConditionPreviewProps[] = [
    {
        category: "Schedule",
        description: "Ensures the trigger fires only if today is Monday.",
        label: "Run only on Mondays",
        type: "sql",
        value: "SELECT date_format(current_date, 'E') = 'Mon'"
    },
    {
        category: "Schedule",
        description: "Limits execution to between 8 AM and 6 PM local time.",
        label: "Business hours only",
        type: "sql",
        value: "SELECT hour(current_timestamp()) BETWEEN 8 AND 18"
    },
    {
        category: "Table",
        description: "Verifies that new records arrived within the past hour.",
        label: "Fresh data check",
        type: "sql",
        value: "SELECT max(event_ts) > now() - INTERVAL 1 HOUR FROM catalog.db.events"
    },
    {
        category: "Table",
        description: "Only runs if the target table contains more than 100,000 rows.",
        label: "Row count threshold",
        type: "sql",
        value: "SELECT count(*) > 100000 FROM catalog.sales.transactions"
    },
    {
        category: "Table",
        description: "Triggers when the average data quality score exceeds 95%.",
        label: "High data quality",
        type: "sql",
        value: "SELECT avg(score) > 0.95 FROM catalog.dq.results WHERE table='bronze.customers'"
    },
    {
        category: "Job",
        description: "Waits for both upstream jobs to finish successfully before triggering.",
        label: "Job A and Job B completed",
        type: "sql",
        value: "SELECT count(*) = 2 FROM system.job_runs WHERE job_name IN ('JobA','JobB') AND status='Succeeded' AND start_time > current_date"
    },
    {
        category: "Table",
        description: "Triggers only if null and duplicate rates stay below acceptable thresholds.",
        label: "No data anomalies",
        type: "sql",
        value: "SELECT null_rate < 0.01 AND dup_rate < 0.001 FROM catalog.metrics.table_health WHERE table='customers'"
    }
];

interface TriggerDialogProps {
    open?: boolean;
    resetTrigger?: number;
    initialTrigger?: Partial<TriggerProps>;
    onOpenChange?: (open: boolean) => void;
    onSubmit?: (trigger: TriggerProps) => void;
}

export default function TriggerDialog({ open, onOpenChange, onSubmit }: TriggerDialogProps) {
    const [activationWindowMode, setActivationWindowMode] = useState<string>("on");
    const [depth, setDepth] = useState(0);
    const [showAdvancedConfiguration, setShowAdvancedConfiguration] = useState<boolean>(false);
    const [showCronSyntax, setShowCronSyntax] = useState<boolean>(false);
    const [trigger, setTrigger] = useState<TriggerProps>({
        interval: 1,
        scheduleMode: "interval",
        status: true,
        timeUnit: "day",
        type: "schedule"
    });
    const [triggerConditions, setTriggerConditions] = useState<TriggerConditionProps[]>([]);

    const handleConditionSelect = (condition: ConditionPreviewProps) => {
        const newCondition: TriggerConditionProps = {
            id: crypto.randomUUID(),
            label: condition.label,
            type: condition.type,
            value: condition.value,
        };
        
        setTriggerConditions([...triggerConditions, newCondition]);
        setDepth(0);
    };

    return (
        <Dialog
            defaultDepth={depth}
            onOpenChange={onOpenChange}
            open={open}
            setDepth={setDepth}
        >
            <DialogContent className="sm:max-w-[600px] border-(--du-bois-color-border) flex flex-col max-h-[90vh]">
                <DialogHeader>
                    {depth === 0 && (
                        <div className="items-center flex gap-2 justify-between">
                            <DialogTitle>New trigger</DialogTitle>
                            <DialogClose asChild>
                                <Button
                                    className="rounded-sm text-gray-600 h-8 p-2 w-8"
                                    size="icon"
                                    variant="ghost"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </DialogClose>
                        </div>
                    )}

                    {depth === 1 && (
                        <div className="items-center flex gap-2">
                            <Button
                                className="rounded-sm text-gray-600 h-8 p-2 w-8"
                                onClick={() => setDepth(0)}
                                size="icon"
                                variant="ghost"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <DialogTitle>Pick a condition</DialogTitle>
                        </div>
                    )}
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto">
                    {depth === 0 && (
                        <FieldSet>
                            <FieldGroup className="gap-4">
                                {/* Status */}
                                <Field className="items-start" orientation="horizontal">
                                    <FieldLabel className="min-w-[144px]" htmlFor="trigger-status">Status</FieldLabel>
                                    <Field className="items-start gap-1.5" orientation="horizontal">
                                        <Switch
                                            checked={trigger.status}
                                            className="data-[state=checked]:bg-(--du-bois-blue-600)"
                                            onCheckedChange={(checked) => setTrigger((prev) => ({ ...prev, status: checked }))}
                                        />
                                        <Label className="font-[400] mt-0.5" htmlFor="trigger-status">
                                            {trigger.status ? "Active" : "Paused"}
                                        </Label>

                                        {/* <RadioGroup
                                            value={trigger.status === false ? "paused" : "active"}
                                            onValueChange={(value) => setTrigger((prev) => ({
                                                ...prev,
                                                status: value === "active"
                                            }))}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="active" id="status-active" />
                                                <Label htmlFor="status-active">Active</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="paused" id="status-paused" />
                                                <Label htmlFor="status-paused">Paused</Label>
                                            </div>
                                        </RadioGroup> */}
                                    </Field>
                                </Field>

                                {/* Type */}
                                <Field className="items-start" orientation="horizontal">
                                    <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="trigger-type">Type</FieldLabel>
                                    <Select
                                        defaultValue={trigger.type}
                                        onValueChange={(value) => setTrigger((prev) => ({ ...prev, type: value as TriggerType }))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a trigger type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="continuous">Continuous</SelectItem>
                                            <SelectItem value="file-arrival">File arrival</SelectItem>
                                            <SelectItem value="schedule">Scheduled</SelectItem>
                                            <SelectItem value="table-update">Table update</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {/* Available trigger types */}
                                {trigger.type === "schedule" && (
                                    <>
                                        {/* <Separator /> */}
                                        <Field className="items-start relative" orientation="horizontal">
                                            <Field className="items-start relative" orientation="horizontal">
                                                <FieldLabel className="left mt-[6px] min-w-[144px] absolute" htmlFor="schedule-type">Schedule type</FieldLabel>
                                                <Tabs className="gap-4 w-full" defaultValue="interval">
                                                    <TabsList className="ml-[calc(144px+8px)] w-[calc(100%-144px-8px)]">
                                                        <TabsTrigger value="interval">Interval</TabsTrigger>
                                                        <TabsTrigger value="cron">Cron</TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent value="interval">
                                                        <FieldSet>
                                                            <FieldGroup className="gap-4">
                                                                <Field className="items-start gap-2" orientation="horizontal">
                                                                    <FieldLabel className="mt-2 min-w-[144px]" htmlFor="run-every">Run every</FieldLabel>
                                                                    <Select defaultValue={trigger.interval?.toString() || "1"} onValueChange={(value) => setTrigger((prev) => ({ ...prev, interval: parseInt(value) }))}>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Select a frequency" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="1">1</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </Field>
                                                                <Field className="items-start gap-2" orientation="horizontal">
                                                                    <FieldLabel className="mt-2 min-w-[144px]" htmlFor="interval">Interval</FieldLabel>
                                                                    <Select defaultValue={trigger.timeUnit || "day"} onValueChange={(value) => setTrigger((prev) => ({ ...prev, timeUnit: value }))}>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Select an interval" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="minute">Minute</SelectItem>
                                                                            <SelectItem value="hour">Hour</SelectItem>
                                                                            <SelectItem value="day">Day</SelectItem>
                                                                            <SelectItem value="week">Week</SelectItem>
                                                                            <SelectItem value="month">Month</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </Field>
                                                            </FieldGroup>
                                                        </FieldSet>
                                                    </TabsContent>
                                                    <TabsContent value="cron">
                                                        <FieldSet>
                                                            <FieldGroup className="gap-4">
                                                                {!showCronSyntax ? (
                                                                    <>
                                                                        <Field className="items-start gap-2" orientation="horizontal">
                                                                            <FieldLabel className="mt-2 min-w-[144px]" htmlFor="run-every">Run every</FieldLabel>
                                                                            <Select defaultValue="1">
                                                                                <SelectTrigger className="w-full">
                                                                                    <SelectValue placeholder="Select a frequency" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="1">1</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </Field>
                                                                        <Field className="items-start gap-2" orientation="horizontal">
                                                                            <FieldLabel className="mt-2 min-w-[144px]" htmlFor="interval">Interval</FieldLabel>
                                                                            <Select defaultValue="day">
                                                                                <SelectTrigger className="w-full">
                                                                                    <SelectValue placeholder="Select an interval" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="minute">Minute</SelectItem>
                                                                                    <SelectItem value="hour">Hour</SelectItem>
                                                                                    <SelectItem value="day">Day</SelectItem>
                                                                                    <SelectItem value="week">Week</SelectItem>
                                                                                    <SelectItem value="month">Month</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </Field>
                                                                        <Field className="items-start gap-2" orientation="horizontal">
                                                                            <FieldLabel className="mt-2 min-w-[144px]" htmlFor="time">Time</FieldLabel>
                                                                            <div className="w-full">
                                                                                <Input
                                                                                    className="bg-background w-auto appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                                                    defaultValue="09:30:00"
                                                                                    id="time"
                                                                                    step="1"
                                                                                    type="time"
                                                                                />
                                                                            </div>
                                                                        </Field>
                                                                        <Field className="items-start gap-2" orientation="horizontal">
                                                                            <FieldLabel className="mt-2 min-w-[144px]" htmlFor="timezone">Timezone</FieldLabel>
                                                                            <Select defaultValue="UTC-04:00">
                                                                                <SelectTrigger className="w-full" id="timezone">
                                                                                    <SelectValue placeholder="Select a timezone" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="UTC-04:00">(UTC-04:00) Eastern Time (US and Canada)</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </Field>
                                                                    </>
                                                                ) : (
                                                                    <Field className="items-start gap-2" orientation="horizontal">
                                                                        <FieldLabel className="mt-2 min-w-[144px]" htmlFor="cron-syntax">Cron syntax</FieldLabel>
                                                                        <div className="w-full">
                                                                            <Input defaultValue="0 30 9 ? * 5" id="cron-syntax" />
                                                                        </div>
                                                                    </Field>
                                                                )}

                                                                <Field className="items-start gap-2" orientation="horizontal">
                                                                    <div className="min-w-[144px]" />
                                                                    <Toggle
                                                                        className="data-[state=on]:bg-(--du-bois-blue-700)/10 data-[state=on]:border-(--du-bois-blue-800) data-[state=on]:text-(--du-bois-blue-800)"
                                                                        id="toggle-cron-syntax"
                                                                        onPressedChange={setShowCronSyntax}
                                                                        pressed={showCronSyntax}
                                                                        variant="outline"
                                                                    >
                                                                        {showCronSyntax ? (<CheckIcon className="size-4" />) : (<div className="border rounded-[4px] size-4" />)}
                                                                        Show cron syntax
                                                                    </Toggle>
                                                                </Field>
                                                            </FieldGroup>
                                                        </FieldSet>
                                                    </TabsContent>
                                                </Tabs>
                                            </Field>
                                        </Field>
                                    </>
                                )}

                                {trigger.type === "file-arrival" && (
                                    <>
                                        {/* <Separator /> */}
                                        <Field className="items-start gap-2" orientation="horizontal">
                                            <FieldLabel className="mt-2 min-w-[144px]" htmlFor="storage-location">Storage location</FieldLabel>
                                            <Input
                                                id="storage-location"
                                                placeholder="e.g. '/Volumes/mycatalog/myschema/myvolume/path_within_volume/' or 'abfss://filesystem@accountname.dfs.core.windows.net/path/'"
                                                value={(trigger as FileArrivalTriggerProps).storageLocation || ""}
                                                onChange={(e) => setTrigger((prev) => ({
                                                    ...prev,
                                                    storageLocation: e.target.value
                                                } as FileArrivalTriggerProps))}
                                            />
                                        </Field>
                                    </>
                                )}

                                {trigger.type === "table-update" && (
                                    <>
                                        {/* <Separator /> */}
                                        <Field className="items-start relative" orientation="horizontal">
                                            <Field className="items-start" orientation="horizontal">
                                                <FieldLabel className="!flex-none mt-2 w-[144px]" htmlFor="table-name">Tables</FieldLabel>
                                                <div className="flex flex-col gap-2 w-full">
                                                    {((trigger as TableUpdateTriggerProps).tableUpdate?.names || [{ name: "" }]).map((table, index, arr) => (
                                                        <div className="flex gap-1" key={index}>
                                                            <Input
                                                                id={`table-name-${index}`}
                                                                onChange={(e) => setTrigger((prev) => {
                                                                    const tableUpdatePrev = prev as TableUpdateTriggerProps;
                                                                    return {
                                                                        ...prev,
                                                                        tableUpdate: {
                                                                            ...tableUpdatePrev.tableUpdate,
                                                                            names: (tableUpdatePrev.tableUpdate?.names || [{ name: "" }]).map((t, i) =>
                                                                                i === index ? { name: e.target.value } : t
                                                                            )
                                                                        }
                                                                    } as TableUpdateTriggerProps;
                                                                })}
                                                                placeholder='Table name (e.g. "mycatalog.myschema.mytable")'
                                                                value={table.name}
                                                            />
                                                            {arr.length > 1 && (
                                                                <Button
                                                                    onClick={() => setTrigger((prev) => {
                                                                        const tableUpdatePrev = prev as TableUpdateTriggerProps;
                                                                        return {
                                                                            ...prev,
                                                                            tableUpdate: {
                                                                                ...tableUpdatePrev.tableUpdate,
                                                                                names: tableUpdatePrev.tableUpdate?.names.filter((_t, i) => i !== index) || []
                                                                            }
                                                                        } as TableUpdateTriggerProps;
                                                                    })}
                                                                    size="icon"
                                                                    variant="ghost"
                                                                >
                                                                    <TrashIcon />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <Button
                                                        className="self-start gap-1"
                                                        onClick={() => setTrigger((prev) => {
                                                            const tableUpdatePrev = prev as TableUpdateTriggerProps;
                                                            return {
                                                                ...prev,
                                                                tableUpdate: {
                                                                    ...tableUpdatePrev.tableUpdate,
                                                                    names: [
                                                                        ...(tableUpdatePrev.tableUpdate?.names || []),
                                                                        { name: "" }
                                                                    ]
                                                                }
                                                            } as TableUpdateTriggerProps;
                                                        })}
                                                        variant="outline"
                                                    >
                                                        <PlusIcon className="text-neutral-600 size-4" />
                                                        <span>Add table</span>
                                                    </Button>
                                                </div>
                                            </Field>
                                        </Field>
                                    </>
                                )}

                                <Separator />
                                <div className="items-center flex gap-2 justify-between">
                                    <div className="flex gap-2 text-sm">
                                        <span className="font-medium">Advanced configuration</span>
                                        <span className="text-neutral-600">Optional</span>
                                    </div>
                                    <Button
                                        onClick={() => setShowAdvancedConfiguration(!showAdvancedConfiguration)}
                                        size="icon-sm"
                                        variant="ghost"
                                    >
                                        {showAdvancedConfiguration ? (<ChevronUpIcon />) : (<ChevronDownIcon />)}
                                    </Button>
                                </div>
                                {showAdvancedConfiguration && (
                                    <>
                                        {/* Continuous-specific: Task Retry Mode */}
                                        {trigger.type === "continuous" && (
                                            <>
                                                <Field className="items-start gap-2" orientation="horizontal">
                                                    <FieldLabel className="!flex-none w-[144px]" htmlFor="task-retry-mode">Task retry mode</FieldLabel>
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <RadioGroup
                                                            value={(trigger as ContinuousTriggerProps).taskRetryMode || "on-failure"}
                                                            onValueChange={(value) => setTrigger((prev) => ({
                                                                ...prev,
                                                                taskRetryMode: value as "on-failure" | "never"
                                                            } as ContinuousTriggerProps))}
                                                        >
                                                            <Field orientation="horizontal">
                                                                <RadioGroupItem id="retry-on-failure" value="on-failure"  />
                                                                <FieldContent>
                                                                    <FieldLabel htmlFor="retry-on-failure">On failure</FieldLabel>
                                                                    <FieldDescription className="text-xs">
                                                                        When on failure is selected, failing tasks will retry as long as other tasks are still running in their first attempt. If all tasks are stuck retrying, a new job run will be created.
                                                                    </FieldDescription>
                                                                </FieldContent>
                                                            </Field>
                                                            <Field orientation="horizontal">
                                                                <RadioGroupItem id="retry-never" value="never"  />
                                                                <FieldContent>
                                                                    <FieldLabel htmlFor="retry-never">Never</FieldLabel>
                                                                    <FieldDescription className="text-xs">
                                                                        When never is selected, tasks that fail will not be retried. The next run will start when the current run completes.
                                                                    </FieldDescription>
                                                                </FieldContent>
                                                            </Field>
                                                        </RadioGroup>
                                                    </div>
                                                </Field>
                                                <Separator />
                                            </>
                                        )}

                                        {/* File Arrival / Table Update: Timing Controls */}
                                        {(trigger.type === "file-arrival" || trigger.type === "table-update") && (
                                            <>
                                                <Field className="items-start gap-2" orientation="horizontal">
                                                    <FieldLabel className="!flex-none gap-1.5 w-[144px]" htmlFor="min-time-between-triggers">
                                                        Minimum time between triggers
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <InfoIcon className="text-neutral-400 shrink-0 size-4" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Minimum time to wait before triggering again
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </FieldLabel>
                                                    <Input
                                                        className="w-32"
                                                        id="min-time-between-triggers"
                                                        value={secondsToTimeString((trigger as FileArrivalTriggerProps | TableUpdateTriggerProps).minTimeBetweenTriggers)}
                                                        onChange={(e) => {
                                                            const seconds = parseTimeString(e.target.value);
                                                            setTrigger((prev) => ({
                                                                ...prev,
                                                                minTimeBetweenTriggers: seconds
                                                            }));
                                                        }}
                                                        placeholder="00h 00m"
                                                    />
                                                </Field>
                                                <Field className="items-start gap-2" orientation="horizontal">
                                                    <FieldLabel className="!flex-none gap-1.5 w-[144px]" htmlFor="wait-after-last-change">
                                                        Wait after last change
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <InfoIcon className="text-neutral-400 shrink-0 size-4" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Time to wait after detecting the last change
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </FieldLabel>
                                                    <Input
                                                        id="wait-after-last-change"
                                                        placeholder="00h 00m"
                                                        className="w-32"
                                                        value={secondsToTimeString((trigger as FileArrivalTriggerProps | TableUpdateTriggerProps).waitAfterLastChange)}
                                                        onChange={(e) => {
                                                            const seconds = parseTimeString(e.target.value);
                                                            setTrigger((prev) => ({
                                                                ...prev,
                                                                waitAfterLastChange: seconds
                                                            }));
                                                        }}
                                                    />
                                                </Field>
                                                <Separator />
                                            </>
                                        )}

                                        {/* All types: Activation Window */}
                                        <>
                                            <Field className="items-start gap-2" orientation="horizontal">
                                                <FieldLabel className="!flex-none mt-2 gap-1.5 w-[144px]" htmlFor="activation-window">
                                                    Activation window
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <InfoIcon className="text-neutral-400 size-4" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Restrict when the trigger can activate based on time of day.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </FieldLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setActivationWindowMode(value);
                                                        if (value === "on") {
                                                            setTrigger((prev) => ({
                                                                ...prev,
                                                                activation: undefined
                                                            }));
                                                        } else {
                                                            setTrigger((prev) => ({
                                                                ...prev,
                                                                activation: {
                                                                    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                                                                    endTime: "17:30:00",
                                                                    startTime: "09:30:00",
                                                                    timezone: "UTC-04:00"
                                                                }
                                                            }));
                                                        }
                                                    }}
                                                    value={activationWindowMode}
                                                >
                                                    <SelectTrigger className="w-full" id="activation-window">
                                                        <SelectValue placeholder="Select an activation window" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="on">Always on</SelectItem>
                                                        <SelectItem value="custom">Custom</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                            {activationWindowMode !== "on" && (
                                                <div className="flex flex-col gap-4">
                                                    <Field className="items-start gap-2" orientation="horizontal">
                                                        <FieldLabel className="!flex-none mt-2 w-[144px]" htmlFor="time-days">Days</FieldLabel>
                                                        <ToggleGroup
                                                            onValueChange={(value: Days[]) => setTrigger((prev) => ({
                                                                ...prev,
                                                                activation: prev.activation ? {
                                                                    ...prev.activation,
                                                                    days: value
                                                                } : undefined
                                                            }))}
                                                            spacing={1.5}
                                                            type="multiple"
                                                            value={trigger.activation?.days || []}
                                                        >
                                                            {[
                                                                { value: "Sun", label: "Sunday" },
                                                                { value: "Mon", label: "Monday" },
                                                                { value: "Tue", label: "Tuesday" },
                                                                { value: "Wed", label: "Wednesday" },
                                                                { value: "Thu", label: "Thursday" },
                                                                { value: "Fri", label: "Friday" },
                                                                { value: "Sat", label: "Saturday" },
                                                            ].map((day) => (
                                                                <Tooltip key={day.value}>
                                                                    <ToggleGroupItem
                                                                        asChild
                                                                        className="data-[state=on]:bg-(--du-bois-blue-700)/10 data-[state=on]:border-(--du-bois-blue-800) data-[state=on]:text-(--du-bois-blue-800) min-w-10"
                                                                        value={day.value}
                                                                        variant="outline"
                                                                    >
                                                                        <TooltipTrigger>
                                                                            {day.value[0]}
                                                                        </TooltipTrigger>
                                                                    </ToggleGroupItem>
                                                                    <TooltipContent>{day.label}</TooltipContent>
                                                                </Tooltip>
                                                            ))}
                                                        </ToggleGroup>
                                                    </Field>
                                                    <Field className="items-start gap-2" orientation="horizontal">
                                                        <FieldLabel className="!flex-none mt-2 w-[144px]" htmlFor="time-start">Time range</FieldLabel>
                                                        <div className="items-center flex gap-2 w-full">
                                                            <Input
                                                                className="bg-background w-auto appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                                defaultValue="09:30:00"
                                                                id="time-start"
                                                                step="1"
                                                                type="time"
                                                            />
                                                            <span>-</span>
                                                            <Input
                                                                className="bg-background w-auto appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                                defaultValue="17:30:00"
                                                                id="time-end"
                                                                step="1"
                                                                type="time"
                                                            />
                                                        </div>
                                                    </Field>
                                                    <Field className="items-start gap-2" orientation="horizontal">
                                                        <FieldLabel className="!flex-none mt-2 w-[144px]" htmlFor="time-timezone">Timezone</FieldLabel>
                                                        <Select defaultValue="UTC-04:00">
                                                            <SelectTrigger className="w-full" id="time-timezone">
                                                                <SelectValue placeholder="Select a timezone" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="UTC-04:00">(UTC-04:00) Eastern Time (US and Canada)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>
                                                </div>
                                            )}
                                            
                                            <Separator />
                                        </>

                                        <Field className="items-start gap-2" orientation="horizontal">
                                            <FieldLabel className="!flex-none mt-2 w-[144px]" htmlFor="trigger-condition">
                                                Trigger condition
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <InfoIcon className="text-neutral-400 size-4" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>{/* Add tooltip content here */}</TooltipContent>
                                                </Tooltip>
                                            </FieldLabel>
                                            <Combobox
                                                onValueChange={(details: any) => {
                                                    const selectedValue = details?.value?.[0];
                                                    if (selectedValue) {
                                                        const trigger = exampleSQLTriggers.find(t => t.label === selectedValue);
                                                        if (trigger) {
                                                            const newCondition: TriggerConditionProps = {
                                                                id: crypto.randomUUID(),
                                                                label: trigger.label,
                                                                type: trigger.type,
                                                                value: trigger.value,
                                                            };
                                                            setTriggerConditions([...triggerConditions, newCondition]);
                                                        }
                                                    }
                                                }}
                                            >
                                                <ComboboxInput
                                                    className="w-full"
                                                    id="trigger-condition"
                                                    placeholder="Select a trigger condition"
                                                />
                                                <ComboboxContent className="p-1">
                                                    <ComboboxList>
                                                        {exampleSQLTriggers.map((trigger) => (
                                                            <ComboboxItem key={trigger.label} value={trigger.label}>
                                                                <div className="items-center flex flex-1 justify-between w-full">
                                                                    <span>{trigger.label}</span>
                                                                    <div className="items-center flex gap-1">
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    className="rounded-sm size-6 hover:bg-black/5"
                                                                                    size="icon-sm"
                                                                                    variant="ghost"
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                >
                                                                                    <EyeIcon className="text-(--du-bois-text-secondary) size-4" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="max-w-md">
                                                                                <pre className="overflow-x-auto text-xs whitespace-pre-wrap">
                                                                                    <code>{trigger.value}</code>
                                                                                </pre>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                        <Button
                                                                            className="rounded-sm size-6 hover:bg-black/5"
                                                                            size="icon-sm"
                                                                            variant="ghost"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <ExternalLinkIcon className="text-(--du-bois-blue-600) size-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </ComboboxItem>
                                                        ))}
                                                    </ComboboxList>
                                                </ComboboxContent>
                                            </Combobox>
                                        </Field>
                                        <div className="flex flex-col gap-4">
                                            {triggerConditions.map((condition, index) => (
                                                <Condition
                                                    key={index}
                                                    {...condition}
                                                    onDelete={() => setTriggerConditions(triggerConditions.filter((_, i) => i !== index))}
                                                    onRun={() => {}}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </FieldGroup>
                        </FieldSet>
                    )}
                </div>
                
                <DialogFooter>
                    {depth === 0 && (
                        <>
                            <DialogClose asChild>
                                <Button className="rounded-sm" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                className="bg-(--du-bois-blue-600) rounded-sm"
                                onClick={() => {
                                    const triggerWithConditions = {
                                        ...trigger,
                                        conditions: triggerConditions
                                    };
                                    onSubmit?.(triggerWithConditions);
                                    onOpenChange?.(false);
                                }}
                            >
                                Create
                            </Button>
                        </>
                    )}

                    {depth === 1 && (
                        <>
                            <Button
                                className="rounded-sm"
                                onClick={() => setDepth(0)}
                                variant="outline"
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
