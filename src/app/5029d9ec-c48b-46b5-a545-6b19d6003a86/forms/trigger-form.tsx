"use client";

import { useState } from "react";

import { CheckIcon, ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, EyeIcon, InfoIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Condition, Props as TriggerConditionProps } from "@/app/81ae035b-057f-45d5-8d8b-e82583bc2a65/components/condition";
import { ConditionProps as ConditionPreviewProps } from "@/app/81ae035b-057f-45d5-8d8b-e82583bc2a65/components/conditions";
import { TimezoneSelect } from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/components/timezone-select";

interface TableProps {
    name: string;
}

interface TableUpdateProps {
    condition?: "all-updated" | "any-updated";
    names: TableProps[];
}

type Days = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type TriggerType = "continuous" | "file-arrival" | "schedule" | "table-update";

interface BaseTriggerProps {
    id?: string;
    status?: boolean;
    conditions?: TriggerConditionProps[];
    activation?: {
        days: Days[];
        endTime: string;
        startTime: string;
        timezone?: string;
    };
}

interface ScheduleTriggerProps extends BaseTriggerProps {
    type: "schedule";
    scheduleMode?: "interval" | "cron";
    interval?: number;
    timeUnit?: string;
    cronExpression?: string;
    minuteOffset?: number;
    monthDays?: number[];
    time?: string;
    timezone?: string;
    weekDays?: Days[];
}

interface ContinuousTriggerProps extends BaseTriggerProps {
    type: "continuous";
    taskRetryMode?: "on-failure" | "never";
}

interface FileArrivalTriggerProps extends BaseTriggerProps {
    type: "file-arrival";
    storageLocation?: string;
    minTimeBetweenTriggers?: number;
    waitAfterLastChange?: number;
}

interface TableUpdateTriggerProps extends BaseTriggerProps {
    type: "table-update";
    tableUpdate?: TableUpdateProps;
    minTimeBetweenTriggers?: number;
    waitAfterLastChange?: number;
}

export type TriggerProps = ScheduleTriggerProps | ContinuousTriggerProps | FileArrivalTriggerProps | TableUpdateTriggerProps;

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
    { category: "Schedule", description: "Ensures the trigger fires only if today is Monday.", label: "Run only on Mondays", type: "sql", value: "SELECT date_format(current_date, 'E') = 'Mon'" },
    { category: "Schedule", description: "Limits execution to between 8 AM and 6 PM local time.", label: "Business hours only", type: "sql", value: "SELECT hour(current_timestamp()) BETWEEN 8 AND 18" },
    { category: "Table", description: "Verifies that new records arrived within the past hour.", label: "Fresh data check", type: "sql", value: "SELECT max(event_ts) > now() - INTERVAL 1 HOUR FROM catalog.db.events" },
    { category: "Table", description: "Only runs if the target table contains more than 100,000 rows.", label: "Row count threshold", type: "sql", value: "SELECT count(*) > 100000 FROM catalog.sales.transactions" },
    { category: "Table", description: "Triggers when the average data quality score exceeds 95%.", label: "High data quality", type: "sql", value: "SELECT avg(score) > 0.95 FROM catalog.dq.results WHERE table='bronze.customers'" },
    { category: "Job", description: "Waits for both upstream jobs to finish successfully before triggering.", label: "Job A and Job B completed", type: "sql", value: "SELECT count(*) = 2 FROM system.job_runs WHERE job_name IN ('JobA','JobB') AND status='Succeeded' AND start_time > current_date" },
    { category: "Table", description: "Triggers only if null and duplicate rates stay below acceptable thresholds.", label: "No data anomalies", type: "sql", value: "SELECT null_rate < 0.01 AND dup_rate < 0.001 FROM catalog.metrics.table_health WHERE table='customers'" }
];

const DEFAULT_TRIGGER: TriggerProps = {
    conditions: [],
    interval: 1,
    scheduleMode: "interval",
    status: true,
    time: "09:00:00",
    timeUnit: "day",
    type: "schedule"
};

const DAYS = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
];


const WEEK_DAYS: { label: string; value: Days }[] = [
    { label: "Sunday", value: "Sun" },
    { label: "Monday", value: "Mon" },
    { label: "Tuesday", value: "Tue" },
    { label: "Wednesday", value: "Wed" },
    { label: "Thursday", value: "Thu" },
    { label: "Friday", value: "Fri" },
    { label: "Saturday", value: "Sat" }
];

export type FieldOrientation = "horizontal" | "vertical";

export interface Props {
    orientation?: FieldOrientation;
    trigger?: TriggerProps;
    variant?: "combined" | "default";
    onChange?: (trigger: TriggerProps) => void;
}

export default function TriggerForm({ onChange, orientation = "horizontal", trigger: triggerProp, variant = "default" }: Props) {
    const [internalTrigger, setInternalTrigger] = useState<TriggerProps>(DEFAULT_TRIGGER);
    const trigger = triggerProp ?? internalTrigger;

    const WEEKDAYS: Days[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const activationWindowMode = !trigger.activation
        ? "on"
        : trigger.activation.days.length === 5 && WEEKDAYS.every((d) => trigger.activation!.days.includes(d))
            ? "weekdays"
            : "custom";
    const [showAdvancedConfiguration, setShowAdvancedConfiguration] = useState<boolean>(false);
    const [showCronSyntax, setShowCronSyntax] = useState<boolean>(false);

    const setTrigger = (updater: TriggerProps | ((prev: TriggerProps) => TriggerProps)) => {
        const next = typeof updater === "function" ? updater(trigger) : updater;
        if (triggerProp !== undefined) {
            onChange?.(next);
        } else {
            setInternalTrigger(next);
            onChange?.(next);
        }
    };

    const triggerConditions = trigger.conditions ?? [];

    const setTriggerConditions = (conditions: TriggerConditionProps[]) => {
        const next = { ...trigger, conditions };
        if (triggerProp !== undefined) {
            onChange?.(next);
        } else {
            setInternalTrigger(next);
            onChange?.(next);
        }
    };

    return (
        <FieldSet>
            <FieldGroup className="gap-4">
                {/* Status */}
                <Field className="items-start gap-4" orientation={orientation}>
                    <FieldLabel className="min-w-[208px]" htmlFor="trigger-status">Status</FieldLabel>
                    <Field className="items-start gap-1.5 w-auto" orientation="horizontal">
                        <Switch
                            checked={trigger.status}
                            className="data-[state=checked]:bg-(--du-bois-blue-600)"
                            onCheckedChange={(checked) => setTrigger((prev) => ({ ...prev, status: checked }))}
                        />
                        <Label className="text-neutral-500 font-[400] mt-0.5" htmlFor="trigger-status">
                            {trigger.status ? "Active" : "Paused"}
                        </Label>
                    </Field>
                </Field>

                {/* Type */}
                <Field className="items-start gap-4" orientation={orientation}>
                    <FieldLabel className="mt-[6px] min-w-[208px]" htmlFor="trigger-type">Type</FieldLabel>
                    <Select
                        defaultValue={trigger.type}
                        onValueChange={(value) => setTrigger((prev) => ({ ...prev, type: value as TriggerType }))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a trigger type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="schedule">Scheduled</SelectItem>
                            <SelectItem value="continuous">Continuous</SelectItem>
                            <SelectItem value="data-change">Data change</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

                {/* Available trigger types */}
                {trigger.type === "schedule" && variant === "combined" && (
                    <>
                        <FieldSet>
                            <FieldGroup className="gap-4">
                                {!showCronSyntax && (
                                    <>
                                        <Field className="items-start gap-4" orientation={orientation}>
                                            <FieldLabel className="mt-2 min-w-[208px]" htmlFor="run-every">Run every</FieldLabel>
                                            <div className="flex gap-2 w-full">
                                                {(() => {
                                                    const unit = (trigger as ScheduleTriggerProps).timeUnit;
                                                    const max = unit === "minute" ? 59 : unit === "hour" ? 23 : unit === "day" ? 31 : 99;
                                                    return (
                                                        <Input
                                                            className="w-23"
                                                            id="schedule-interval"
                                                            max={max}
                                                            min={1}
                                                            onChange={(e) => {
                                                                const n = parseInt(e.target.value, 10);
                                                                if (!Number.isNaN(n)) {
                                                                    setTrigger((prev) => ({ ...prev, interval: Math.min(Math.max(n, 1), max) }));
                                                                }
                                                            }}
                                                            type="number"
                                                            value={(trigger as ScheduleTriggerProps).interval ?? 1}
                                                        />
                                                    );
                                                })()}
                                                <Select
                                                    onValueChange={(value) => {
                                                        const unit = value as ScheduleTriggerProps["timeUnit"];
                                                        setTrigger((prev) => {
                                                            const next = { ...prev, interval: 1, timeUnit: unit };
                                                            if (unit === "week" && !(prev as ScheduleTriggerProps).weekDays?.length) {
                                                                return { ...next, time: (prev as ScheduleTriggerProps).time ?? "09:00:00", weekDays: ["Mon" as Days] };
                                                            }
                                                            if (unit === "month" && !(prev as ScheduleTriggerProps).monthDays?.length) {
                                                                return { ...next, time: (prev as ScheduleTriggerProps).time ?? "09:00:00", monthDays: [1] };
                                                            }
                                                            return next;
                                                        });
                                                    }}
                                                    value={(trigger as ScheduleTriggerProps).timeUnit || "day"}
                                                >
                                                    <SelectTrigger className="flex-1" id="run-every">
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
                                            </div>
                                        </Field>

                                        {(trigger as ScheduleTriggerProps).timeUnit === "week" && (
                                            <Field className="items-start gap-4" orientation={orientation}>
                                                <FieldLabel className="!flex-none mt-2 w-[208px]" htmlFor="schedule-week-days" />
                                                <ToggleGroup
                                                    onValueChange={(value: Days[]) => setTrigger((prev) => ({ ...prev, weekDays: value }))}
                                                    spacing={1.5}
                                                    type="multiple"
                                                    value={(trigger as ScheduleTriggerProps).weekDays ?? []}
                                                >
                                                    {WEEK_DAYS.map((day) => (
                                                        <Tooltip key={day.value}>
                                                            <ToggleGroupItem
                                                                asChild
                                                                className="data-[state=on]:bg-(--du-bois-blue-700)/10 data-[state=on]:border-(--du-bois-blue-800) data-[state=on]:text-(--du-bois-blue-800) min-w-10"
                                                                value={day.value}
                                                                variant="outline"
                                                            >
                                                                <TooltipTrigger>{day.value[0]}</TooltipTrigger>
                                                            </ToggleGroupItem>
                                                            <TooltipContent>{day.label}</TooltipContent>
                                                        </Tooltip>
                                                    ))}
                                                </ToggleGroup>
                                            </Field>
                                        )}

                                        {(trigger as ScheduleTriggerProps).timeUnit === "month" && (
                                            <Field className="items-start gap-4" orientation={orientation}>
                                                <FieldLabel className="mt-2 min-w-[208px]" htmlFor="schedule-month-days" />
                                                <Select
                                                    onValueChange={(value) => setTrigger((prev) => ({ ...prev, monthDays: [value === "last" ? 0 : parseInt(value, 10)] }))}
                                                    value={(() => {
                                                        const days = (trigger as ScheduleTriggerProps).monthDays ?? [];
                                                        const first = days[0];
                                                        if (first === undefined) return "";
                                                        return first === 0 ? "last" : String(first);
                                                    })()}
                                                >
                                                    <SelectTrigger className="w-full" id="schedule-month-days">
                                                        <SelectValue placeholder="Select day" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 31 }, (_, i) => {
                                                            const d = i + 1;
                                                            const ord = d % 10 === 1 && d !== 11 ? "st" : d % 10 === 2 && d !== 12 ? "nd" : d % 10 === 3 && d !== 13 ? "rd" : "th";
                                                            return (
                                                                <SelectItem key={d} value={String(d)}>
                                                                    The {d}{ord}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                        <SelectItem value="last">The last day of the month</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        )}

                                        {(trigger as ScheduleTriggerProps).timeUnit === "hour" && (
                                            <div className="flex items-center gap-2">
                                                <Field className="items-start gap-4 w-auto" orientation={orientation}>
                                                    <FieldLabel className="!flex-none mt-2 min-w-[208px]" htmlFor="schedule-minute-offset" />
                                                    <Select
                                                        onValueChange={(value) => setTrigger((prev) => ({ ...prev, minuteOffset: parseInt(value, 10) }))}
                                                        value={String((trigger as ScheduleTriggerProps).minuteOffset ?? 0)}
                                                    >
                                                        <SelectTrigger className="w-full" id="schedule-minute-offset">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: 60 }, (_, i) => (
                                                                <SelectItem key={i} value={String(i)}>
                                                                    {i} minute(s) past the hour
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                                <div className="min-w-0 flex-1">
                                                    <TimezoneSelect
                                                        onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
                                                        value={(trigger as ScheduleTriggerProps).timezone}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {((trigger as ScheduleTriggerProps).timeUnit === "day" ||
                                            (trigger as ScheduleTriggerProps).timeUnit === "week" ||
                                            (trigger as ScheduleTriggerProps).timeUnit === "month") && (
                                            <div className="flex items-center gap-2">
                                                <Field className="items-start gap-4 w-auto" orientation={orientation}>
                                                    <FieldLabel className="!flex-none mt-2 min-w-[208px]" htmlFor="schedule-time" />
                                                    <Input
                                                        className="bg-background w-auto appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                        id="schedule-time"
                                                        onChange={(e) => setTrigger((prev) => ({ ...prev, time: e.target.value || "09:00:00" }))}
                                                        step="1"
                                                        type="time"
                                                        value={(trigger as ScheduleTriggerProps).time ?? "09:00:00"}
                                                    />
                                                </Field>
                                                <div className="min-w-0 flex-1">
                                                    <TimezoneSelect
                                                        onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
                                                        value={(trigger as ScheduleTriggerProps).timezone}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {showCronSyntax && (
                                    <Field className="items-start gap-4" orientation={orientation}>
                                        <FieldLabel className="mt-2 min-w-[208px]" htmlFor="cron-syntax">Cron syntax</FieldLabel>
                                        <div className="flex flex-col gap-2 w-full">
                                            <Input
                                                className="font-mono w-full"
                                                id="cron-syntax"
                                                onChange={(e) => setTrigger((prev) => ({ ...prev, cronExpression: e.target.value }))}
                                                placeholder="0 30 9 ? * 1-5"
                                                value={(trigger as ScheduleTriggerProps).cronExpression ?? ""}
                                            />
                                            <div className="flex min-w-0 flex-1 justify-start">
                                                <TimezoneSelect
                                                    onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
                                                    value={(trigger as ScheduleTriggerProps).timezone}
                                                />
                                            </div>
                                        </div>
                                    </Field>
                                )}

                                <Field className="items-start gap-4" orientation={orientation}>
                                    <FieldLabel className="!flex-none min-w-[208px]" />
                                    <Button
                                        className="rounded-sm px-3"
                                        onClick={() => setShowCronSyntax(!showCronSyntax)}
                                        variant="outline"
                                    >
                                        <span className={`items-center rounded-xs text-(--du-bois-blue-600) flex shrink-0 justify-center size-4 ${showCronSyntax ? "" : "border"}`}>
                                            {showCronSyntax && <CheckIcon className="size-4" />}
                                        </span>
                                        <span>Show cron syntax</span>
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </>
                )}

                {trigger.type === "schedule" && variant !== "combined" && (
                    <>
                        <Field className="items-start relative" orientation={orientation}>
                            <Field className="items-start relative" orientation={orientation}>
                                <FieldLabel className="left mt-[6px] min-w-[208px] absolute" htmlFor="schedule-type">Schedule type</FieldLabel>
                                <Tabs className="gap-4 w-full" defaultValue="interval">
                                    <TabsList className="ml-[calc(208px+16px)] w-[calc(100%-208px-16px)]">
                                        <TabsTrigger value="interval">Interval</TabsTrigger>
                                        <TabsTrigger value="cron">Cron</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="interval">
                                        <FieldSet>
                                            <FieldGroup className="gap-4">
                                                <Field className="items-start gap-4" orientation={orientation}>
                                                    <FieldLabel className="mt-2 min-w-[208px]" htmlFor="run-every">Run every</FieldLabel>
                                                    <div className="flex gap-2 w-full">
                                                        {(() => {
                                                            const unit = (trigger as ScheduleTriggerProps).timeUnit;
                                                            const max = unit === "minute" ? 59 : unit === "hour" ? 23 : unit === "day" ? 31 : 99;
                                                            return (
                                                                <Input
                                                                    className="w-23"
                                                                    id="schedule-interval"
                                                                    max={max}
                                                                    min={1}
                                                                    onChange={(e) => {
                                                                        const n = parseInt(e.target.value, 10);
                                                                        if (!Number.isNaN(n)) {
                                                                            setTrigger((prev) => ({ ...prev, interval: Math.min(Math.max(n, 1), max) }));
                                                                        }
                                                                    }}
                                                                    type="number"
                                                                    value={(trigger as ScheduleTriggerProps).interval ?? 1}
                                                                />
                                                            );
                                                        })()}
                                                        <Select
                                                            onValueChange={(value) => {
                                                                const unit = value as ScheduleTriggerProps["timeUnit"];
                                                                setTrigger((prev) => {
                                                                    const next = { ...prev, interval: 1, timeUnit: unit };
                                                                    if (unit === "week" && !(prev as ScheduleTriggerProps).weekDays?.length) {
                                                                        return { ...next, time: (prev as ScheduleTriggerProps).time ?? "09:00:00", weekDays: ["Mon" as Days] };
                                                                    }
                                                                    if (unit === "month" && !(prev as ScheduleTriggerProps).monthDays?.length) {
                                                                        return { ...next, time: (prev as ScheduleTriggerProps).time ?? "09:00:00", monthDays: [1] };
                                                                    }
                                                                    return next;
                                                                });
                                                            }}
                                                            value={(trigger as ScheduleTriggerProps).timeUnit || "day"}
                                                        >
                                                            <SelectTrigger className="flex-1" id="run-every">
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
                                                    </div>
                                                </Field>

                                                {(trigger as ScheduleTriggerProps).timeUnit === "week" && (
                                                    <Field className="items-start gap-4" orientation={orientation}>
                                                        <FieldLabel className="!flex-none mt-2 w-[208px]" htmlFor="schedule-week-days" />
                                                        <ToggleGroup
                                                            onValueChange={(value: Days[]) => setTrigger((prev) => ({ ...prev, weekDays: value }))}
                                                            spacing={1.5}
                                                            type="multiple"
                                                            value={(trigger as ScheduleTriggerProps).weekDays ?? []}
                                                        >
                                                            {WEEK_DAYS.map((day) => (
                                                                <Tooltip key={day.value}>
                                                                    <ToggleGroupItem
                                                                        asChild
                                                                        className="data-[state=on]:bg-(--du-bois-blue-700)/10 data-[state=on]:border-(--du-bois-blue-800) data-[state=on]:text-(--du-bois-blue-800) min-w-10"
                                                                        value={day.value}
                                                                        variant="outline"
                                                                    >
                                                                        <TooltipTrigger>{day.value[0]}</TooltipTrigger>
                                                                    </ToggleGroupItem>
                                                                    <TooltipContent>{day.label}</TooltipContent>
                                                                </Tooltip>
                                                            ))}
                                                        </ToggleGroup>
                                                    </Field>
                                                )}

                                                {(trigger as ScheduleTriggerProps).timeUnit === "month" && (
                                                    <Field className="items-start gap-4" orientation={orientation}>
                                                        <FieldLabel className="mt-2 min-w-[208px]" htmlFor="schedule-month-days" />
                                                        <Select
                                                            onValueChange={(value) => setTrigger((prev) => ({ ...prev, monthDays: [value === "last" ? 0 : parseInt(value, 10)] }))}
                                                            value={(() => {
                                                                const days = (trigger as ScheduleTriggerProps).monthDays ?? [];
                                                                const first = days[0];
                                                                if (first === undefined) return "";
                                                                return first === 0 ? "last" : String(first);
                                                            })()}
                                                        >
                                                            <SelectTrigger className="w-full" id="schedule-month-days">
                                                                <SelectValue placeholder="Select day" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Array.from({ length: 31 }, (_, i) => {
                                                                    const d = i + 1;
                                                                    const ord = d % 10 === 1 && d !== 11 ? "st" : d % 10 === 2 && d !== 12 ? "nd" : d % 10 === 3 && d !== 13 ? "rd" : "th";
                                                                    return (
                                                                        <SelectItem key={d} value={String(d)}>
                                                                            The {d}{ord}
                                                                        </SelectItem>
                                                                    );
                                                                })}
                                                                <SelectItem value="last">The last day of the month</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>
                                                )}

                                                {(trigger as ScheduleTriggerProps).timeUnit === "hour" && (
                                                    <div className="flex items-center gap-2">
                                                        <Field className="items-start gap-4 w-auto" orientation={orientation}>
                                                            <FieldLabel className="!flex-none mt-2 min-w-[208px]" htmlFor="schedule-minute-offset" />
                                                            <Select
                                                                onValueChange={(value) => setTrigger((prev) => ({ ...prev, minuteOffset: parseInt(value, 10) }))}
                                                                value={String((trigger as ScheduleTriggerProps).minuteOffset ?? 0)}
                                                            >
                                                                <SelectTrigger className="w-full" id="schedule-minute-offset">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Array.from({ length: 60 }, (_, i) => (
                                                                        <SelectItem key={i} value={String(i)}>
                                                                            {i} minute(s) past the hour
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </Field>
                                                        <div className="min-w-0 flex-1">
                                                            <TimezoneSelect
                                                                onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
                                                                value={(trigger as ScheduleTriggerProps).timezone}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {((trigger as ScheduleTriggerProps).timeUnit === "day" ||
                                                    (trigger as ScheduleTriggerProps).timeUnit === "week" ||
                                                    (trigger as ScheduleTriggerProps).timeUnit === "month") && (
                                                    <div className="flex items-center gap-2">
                                                        <Field className="items-start gap-4 w-auto" orientation={orientation}>
                                                            <FieldLabel className="!flex-none mt-2 min-w-[208px]" htmlFor="schedule-time" />
                                                            <Input
                                                                className="bg-background w-auto appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                                id="schedule-time"
                                                                onChange={(e) => setTrigger((prev) => ({ ...prev, time: e.target.value || "09:00:00" }))}
                                                                step="1"
                                                                type="time"
                                                                value={(trigger as ScheduleTriggerProps).time ?? "09:00:00"}
                                                            />
                                                        </Field>
                                                        <div className="min-w-0 flex-1">
                                                            <TimezoneSelect
                                                                onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
                                                                value={(trigger as ScheduleTriggerProps).timezone}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </FieldGroup>
                                        </FieldSet>
                                    </TabsContent>
                                    <TabsContent value="cron">
                                        <FieldSet>
                                            <FieldGroup className="gap-4">
                                                <Field className="items-start gap-4" orientation={orientation}>
                                                    <FieldLabel className="mt-2 min-w-[208px]" htmlFor="cron-syntax">Cron syntax</FieldLabel>
                                                    <Input
                                                        className="font-mono w-full"
                                                        id="cron-syntax"
                                                        onChange={(e) => setTrigger((prev) => ({ ...prev, cronExpression: e.target.value }))}
                                                        placeholder="0 30 9 ? * 1-5"
                                                        value={(trigger as ScheduleTriggerProps).cronExpression ?? ""}
                                                    />
                                                </Field>
                                                <Field className="items-start gap-4" orientation={orientation}>
                                                    <FieldLabel className="!flex-none mt-2 min-w-[208px]" />
                                                    <div className="flex min-w-0 flex-1 justify-start">
                                                        <TimezoneSelect
                                                            onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
                                                            value={(trigger as ScheduleTriggerProps).timezone}
                                                        />
                                                    </div>
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
                        <Field className="items-start gap-4" orientation={orientation}>
                            <FieldLabel className="mt-2 min-w-[208px]" htmlFor="storage-location">Storage location</FieldLabel>
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
                        <Field className="items-start relative" orientation={orientation}>
                            <Field className="items-start" orientation={orientation}>
                                <FieldLabel className="!flex-none mt-2 w-[208px]" htmlFor="table-name">Tables</FieldLabel>
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
                <div className="items-center flex gap-2">
                    <span className="text-sm font-medium">Advanced configuration</span>
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
                                <Field className="items-start gap-4" orientation={orientation}>
                                    <FieldLabel className="!flex-none w-[208px]" htmlFor="task-retry-mode">Task retry mode</FieldLabel>
                                    <div className="flex flex-col gap-2 w-full">
                                        <RadioGroup
                                            value={(trigger as ContinuousTriggerProps).taskRetryMode || "on-failure"}
                                            onValueChange={(value) => setTrigger((prev) => ({
                                                ...prev,
                                                taskRetryMode: value as "on-failure" | "never"
                                            } as ContinuousTriggerProps))}
                                        >
                                            <Field orientation={orientation}>
                                                <RadioGroupItem id="retry-on-failure" value="on-failure"  />
                                                <FieldContent>
                                                    <FieldLabel htmlFor="retry-on-failure">On failure</FieldLabel>
                                                    <FieldDescription className="text-xs">
                                                        When on failure is selected, failing tasks will retry as long as other tasks are still running in their first attempt. If all tasks are stuck retrying, a new job run will be created.
                                                    </FieldDescription>
                                                </FieldContent>
                                            </Field>
                                            <Field orientation={orientation}>
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
                                <Field className="items-start gap-4" orientation={orientation}>
                                    <FieldLabel className="!flex-none gap-1.5 w-[208px]" htmlFor="min-time-between-triggers">
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
                                <Field className="items-start gap-4" orientation={orientation}>
                                    <FieldLabel className="!flex-none gap-1.5 w-[208px]" htmlFor="wait-after-last-change">
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
                            <Field className="items-start gap-4" orientation={orientation}>
                                <FieldLabel className="!flex-none mt-2 gap-1.5 w-[208px]" htmlFor="activation-window">
                                    Activation window
                                </FieldLabel>
                                <Select
                                    onValueChange={(value) => {
                                        if (value === "on") {
                                            setTrigger((prev) => ({
                                                ...prev,
                                                activation: undefined
                                            }));
                                        } else if (value === "weekdays") {
                                            setTrigger((prev) => ({
                                                ...prev,
                                                activation: {
                                                    ...prev.activation,
                                                    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                                                    endTime: prev.activation?.endTime ?? "17:30:00",
                                                    startTime: prev.activation?.startTime ?? "09:30:00",
                                                }
                                            }));
                                        } else {
                                            setTrigger((prev) => ({
                                                ...prev,
                                                activation: {
                                                    ...prev.activation,
                                                    days: [],
                                                    endTime: prev.activation?.endTime ?? "17:30:00",
                                                    startTime: prev.activation?.startTime ?? "09:30:00",
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
                                        <SelectItem value="on">Always active</SelectItem>
                                        <SelectItem value="weekdays">Weekdays</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            {activationWindowMode !== "on" && (
                                <div className="flex flex-col gap-4">
                                    <Field className="items-start gap-4" orientation={orientation}>
                                        <FieldLabel className="!flex-none mt-2 w-[208px]" htmlFor="time-days">Days</FieldLabel>
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
                                    <Field className="items-start gap-4" orientation={orientation}>
                                        <FieldLabel className="!flex-none mt-2 w-[208px]" htmlFor="time-start">Time range</FieldLabel>
                                        <div className="flex gap-2">
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
                                            <div>
                                                <TimezoneSelect
                                                    onChange={(value) => setTrigger((prev) => ({
                                                        ...prev,
                                                        activation: prev.activation ? {
                                                            ...prev.activation,
                                                            timezone: value
                                                        } : undefined
                                                    }))}
                                                    value={trigger.activation?.timezone}
                                                />
                                            </div>
                                        </div>
                                    </Field>
                                </div>
                            )}

                            <Separator />
                        </>

                        <Field className="items-start gap-4" orientation={orientation}>
                            <FieldLabel className="!flex-none mt-2 w-[208px]" htmlFor="trigger-condition">
                                Trigger condition
                            </FieldLabel>
                            <Combobox
                                onValueChange={(details: { value?: string[] } | null) => {
                                    const selectedValue = details?.value?.[0];
                                    if (selectedValue) {
                                        const conditionTemplate = exampleSQLTriggers.find((t) => t.label === selectedValue);
                                        if (conditionTemplate) {
                                            const newCondition: TriggerConditionProps = {
                                                id: crypto.randomUUID(),
                                                label: conditionTemplate.label,
                                                type: conditionTemplate.type,
                                                value: conditionTemplate.value,
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
                                        {exampleSQLTriggers.map((item) => (
                                            <ComboboxItem key={item.label} value={item.label}>
                                                <div className="items-center flex flex-1 justify-between w-full">
                                                    <span>{item.label}</span>
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
                                                                    <code>{item.value}</code>
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
    );
}
