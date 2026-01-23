"use client";

import { useState } from "react";

import { CheckIcon, ChevronDownIcon, ChevronUpIcon, InfoIcon, PlusIcon, Trash, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Condition, Props as TriggerConditionProps } from "../../../app/216bec6d-e892-413c-a70c-15c977db4dbb/components/condition";

interface ConditionProps {
    condition: "all-updated" | "any-updated";
}

interface FileArrivalProps {
    throttle?: TimingProps;
    url?: string;
}

interface ScheduleProps {
    expression?: string;
    timezone?: string;
}

interface TableProps {
    name: string;
}

interface TableUpdateProps {
    condition?: TimingProps;
    names: TableProps[];
    timing?: TimingProps;
}

interface TimingProps {
    minimumTimeBetweenTriggers?: number;
    waitAfterLastChange?: number;
}

type Days = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type TriggerType = "continuous" | "file-arrival" | "schedule" | "table-update";

interface TriggerProps {
    activation?: {
        days: Days[];
        endTime: string;
        startTime: string;
        timezone: string;
    }
    conditions?: TriggerConditionProps[];
    id?: string;
    status?: boolean;
    tableUpdate?: TableUpdateProps;
    type: TriggerType;
}

const Types = [
    { value: "continuous", label: "Continuous" },
    { value: "file-arrival", label: "File arrival" },
    { value: "schedule", label: "Scheduled" },
    { value: "table-update", label: "Table update" },
];

interface Props {
    onClose?: () => void;
}

export default function Trigger({ onClose }: Props) {
    const [showAdvancedConfiguration, setShowAdvancedConfiguration] = useState<boolean>(false);
    const [trigger, setTrigger] = useState<TriggerProps>({
        type: "schedule",
    });
	const [triggerConditions, setTriggerConditions] = useState<ConditionProps[]>([]);

    return (
        <Dialog onOpenChange={(open) => !open && onClose?.()} open={true}>
            <DialogContent className="sm:max-w-[600px] border-(--du-bois-color-border) flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>New trigger</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                    <FieldSet>
                    <FieldGroup className="gap-4">
                        <Field className="items-start" orientation="horizontal">
                            <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="trigger-type">Trigger type</FieldLabel>
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
                        <Separator />

                        {/* Trigger type */}
                        { trigger.type === "schedule" && (
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
                                                    <Field className="items-start" orientation="horizontal">
                                                        <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="run-every">Run every</FieldLabel>
                                                        <Select defaultValue="1">
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select a frequency" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="1">1</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>
                                                    <Field className="items-start" orientation="horizontal">
                                                        <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="interval">Interval</FieldLabel>
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
                                                </FieldGroup>
                                            </FieldSet>
                                        </TabsContent>
                                        <TabsContent value="cron">Cron</TabsContent>
                                    </Tabs>
                                </Field>
                            </Field>
                        )}

                        { trigger.type === "table-update" && (
                            <Field className="items-start relative" orientation="horizontal">
                                <Field className="items-start" orientation="horizontal">
                                    <FieldLabel className="!flex-none mt-2 w-[144px]" htmlFor="table-name">Tables</FieldLabel>
                                    <div className="flex flex-col gap-2 w-full">
                                        {(trigger.tableUpdate?.names || [{ name: "" }]).map((table, index, arr) => (
                                            <div className="flex gap-1" key={index}>
                                                <Input
                                                    id={`table-name-${index}`}
                                                    onChange={(e) => setTrigger((prev) => ({
                                                        ...prev,
                                                        tableUpdate: {
                                                            ...prev.tableUpdate,
                                                            names: (prev.tableUpdate?.names || [{ name: "" }]).map((t, i) =>
                                                                i === index ? { name: e.target.value } : t
                                                            )
                                                        }
                                                    }))}
                                                    placeholder='Table name (e.g. "mycatalog.myschema.mytable")'
                                                    value={table.name}
                                                />
                                                {arr.length > 1 && (
                                                    <Button
                                                        onClick={() => setTrigger((prev) => ({
                                                            ...prev,
                                                            tableUpdate: {
                                                                ...prev.tableUpdate,
                                                                names: prev.tableUpdate?.names.filter((_, i) => i !== index) || []
                                                            }
                                                        }))}
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
                                            onClick={() => setTrigger((prev) => ({
                                                ...prev,
                                                tableUpdate: {
                                                    ...prev.tableUpdate,
                                                    names: [
                                                        ...(prev.tableUpdate?.names || []),
                                                        { name: "" }
                                                    ]
                                                }
                                            }))}
                                            variant="outline"
                                        >
                                            <PlusIcon className="size-4" />
                                            <span>Add table</span>
                                        </Button>
                                    </div>
                                </Field>
                            </Field>
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
                        { showAdvancedConfiguration && (
                            <>
                                <>
                                    <div className="items-center flex gap-3">
                                        <div className="items-center flex text-sm font-medium gap-1 w-[144px]">
                                            <span>Activation window</span>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InfoIcon className="text-neutral-400 size-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Restrict when the trigger can activate based on time of day.
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <Toggle
                                            className="data-[state=on]:bg-(--du-bois-blue-700)/10 data-[state=on]:border-(--du-bois-blue-800) data-[state=on]:text-(--du-bois-blue-800) gap-1"
                                            onPressedChange={(pressed) => setTrigger((prev) => ({
                                                ...prev,
                                                activation: pressed ? {
                                                    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                                                    endTime: "17:30:00",
                                                    startTime: "09:30:00",
                                                    timezone: "UTC-04:00"
                                                } : undefined
                                            }))}
                                            pressed={!!trigger.activation}
                                            variant="outline"
                                        >
                                            {trigger.activation ? (<CheckIcon className="size-4" />) : (<PlusIcon className="size-4" />)}
                                            <span>Add restriction</span>
                                        </Toggle>
                                    </div>
                                    {trigger.activation && (
                                        <div className="flex flex-col gap-4">
                                            <Field className="items-start" orientation="horizontal">
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
                                            <Field className="items-start" orientation="horizontal">
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
                                            <Field className="items-start" orientation="horizontal">
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

                                <div className="items-center flex gap-2 justify-between">
                                    <div className="text-sm font-medium">Trigger conditions</div>
                                    <Button
                                        onClick={() => setTriggerConditions([
                                            ...triggerConditions,
                                            {
                                                id: `condition-${triggerConditions.length + 1}`,
                                                label: `Condition ${triggerConditions.length + 1}`,
                                                type: "sql",
                                                value: "SELECT COUNT(*) > 0 FROM sales WHERE date = CURRENT_DATE()"
                                            }
                                        ])}
                                        variant="outline"
                                    >
                                        Add trigger condition
                                    </Button>
                                </div>
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
                </div>
                <DialogFooter>
                    <Button
                        className="rounded-sm"
                        onClick={onClose}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-(--du-bois-blue-600) rounded-sm"
                        onClick={() => {}}
                    >
                        Add trigger
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}