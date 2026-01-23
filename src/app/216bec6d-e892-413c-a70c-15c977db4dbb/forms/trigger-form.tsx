"use client";

import { useEffect, useState } from "react";

import { Check, Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";

import { Condition } from "@/app/216bec6d-e892-413c-a70c-15c977db4dbb/components/condition";

// Types 
type TimeUnit = "minute" | "hour" | "day" | "week" | "month";
type TriggerType = "continuous-run" | "file-arrival" | "model-update" | "schedule" | "table-update";

interface ConditionConfig {
    id: string;
    label: string;
    type: "sql" | "python";
    value: string;
}

interface BaseTriggerConfig {
    conditions: ConditionConfig[];
    status: boolean;
    type: TriggerType;
}

interface OtherTriggerConfig extends BaseTriggerConfig {
    type: "continuous-run" | "file-arrival" | "model-update" | "table-update";
}

interface SimpleScheduleConfig extends BaseTriggerConfig {
    interval: number;
    scheduleMode: "simple";
    timeUnit: TimeUnit;
    type: "schedule";
}

interface AdvancedScheduleConfig extends BaseTriggerConfig {
    cronExpression?: string;
    dayOfMonth?: number;
    dayOfWeek?: number;
    hour?: number;
    minute?: number;
    month?: number;
    scheduleMode: "advanced";
    timeUnit: TimeUnit;
    timezone: string;
    type: "schedule";
    useCronExpression: boolean;
}

type TriggerConfig = OtherTriggerConfig | SimpleScheduleConfig | AdvancedScheduleConfig;

type AllKeys<T> = T extends unknown ? keyof T : never;
type TriggerConfigKeys = AllKeys<TriggerConfig>;

// Constants 
const timeUnits: { value: TimeUnit; label: string }[] = [
    { value: "minute", label: "Minute(s)" },
    { value: "hour", label: "Hour(s)" },
    { value: "day", label: "Day(s)" },
    { value: "week", label: "Week(s)" },
    { value: "month", label: "Month(s)" },
];

const triggerTypes: { value: TriggerType; label: string }[] = [
    { value: "continuous-run", label: "Continuous" },
    { value: "schedule", label: "Scheduled" },
    { value: "file-arrival", label: "File arrival" },
    { value: "model-update", label: "Model update" },
    { value: "table-update", label: "Table update" },
];

// Form 
export interface Props {
    debug?: boolean;
    initialConfig?: Partial<TriggerConfig>;
    onBrowseConditions?: () => void;
    onChange?: (config: TriggerConfig) => void;
    onSubmit?: (config: TriggerConfig) => void;
}

export default function TriggerForm({
    debug = false,
    initialConfig,
    onBrowseConditions,
    onChange
}: Props) {
    const [config, setConfig] = useState<TriggerConfig>(() => {
        if (initialConfig) {
            if (initialConfig.type === "schedule") {
                return {
                    status: true,
                    type: "schedule",
                    scheduleMode: "simple",
                    interval: 1,
                    timeUnit: "day",
                    conditions: [],
                    ...initialConfig,
                } as TriggerConfig;
            } else {
                return {
                    status: true,
                    conditions: [],
                    ...initialConfig,
                } as TriggerConfig;
            }
        }

        return {
            status: true,
            type: "schedule",
            scheduleMode: "simple",
            interval: 1,
            timeUnit: "day",
            conditions: [],
        } as TriggerConfig;
    });

    const updateConfig = (
        key: TriggerConfigKeys,
        value: unknown
    ) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        onChange?.(config);
    }, [config, onChange]);
    
    return (
        <div className="flex flex-col gap-4">
            {/* Trigger Status */}
            <div className="flex gap-2 justify-between">
                <Label className="font-semibold min-w-[144px]" htmlFor="status">Trigger status</Label>
                <div className="items-center flex gap-2">
                    <span className="text-neutral-600 text-sm">
                        {config.status ? "Active" : "Paused"}
                    </span>
                    <Switch
                        className="data-[state=on]:bg-blue-600"
                        checked={config.status}
                        data-state={config.status ? "on" : "off"}
                        id="status"
                        onCheckedChange={(checked) =>
                            updateConfig("status", checked)
                        }
                    />
                </div>
            </div>

            {/* Trigger Type */}
            <div className="flex gap-2 justify-between">
                <Label className="font-semibold min-w-[144px]" htmlFor="type">Trigger type</Label>
                <Select
                    onValueChange={(value) => {
                        if (value === "schedule") {
                            setConfig({
                                status: config.status,
                                type: "schedule",
                                scheduleMode: "simple",
                                interval: 1,
                                timeUnit: "day",
                                conditions: config.conditions,
                            });
                        } else {
                            setConfig({
                                status: config.status,
                                type: value as Exclude<TriggerType, "schedule">,
                                conditions: config.conditions,
                            });
                        }
                    }}
                    value={config.type}
                >
                    <SelectTrigger className="rounded-[4px] w-full" id="type">
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent className="border-neutral-200 ">
                        {triggerTypes.map((trigger) => (
                            <SelectItem key={trigger.value} value={trigger.value}>
                                {trigger.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Schedule Configuration */}
            {config.type === "schedule" && (
                <div className="flex gap-2 justify-between relative">
                    <span className="text-sm font-semibold mt-1.5 min-w-[144px] absolute">Schedule type</span>
                    <Tabs
                        className="gap-4 w-full"
                        onValueChange={(value) => {
                            const mode = value as "simple" | "advanced";
                            if (mode === "simple") {
                                setConfig({
                                    status: config.status,
                                    type: "schedule",
                                    scheduleMode: "simple",
                                    interval: 1,
                                    timeUnit: "day",
                                    conditions: config.conditions,
                                });
                            } else {
                                setConfig({
                                    status: config.status,
                                    type: "schedule",
                                    scheduleMode: "advanced",
                                    timezone: "UTC",
                                    timeUnit: "day",
                                    minute: 0,
                                    hour: 0,
                                    useCronExpression: false,
                                    conditions: config.conditions,
                                });
                            }
                        }}
                        value={config.scheduleMode}
                    >
                        <TabsList className="rounded-[4px] ml-[calc(144px+8px)] w-[calc(100%-144px-8px)]">
                            <TabsTrigger className="rounded-[4px]" value="simple">
                                Simple
                            </TabsTrigger>
                            <TabsTrigger className="rounded-[4px]" value="advanced">
                                Advanced
                            </TabsTrigger>
                        </TabsList>

                        {/* Simple Mode */}
                        <TabsContent className="flex flex-col gap-4" value="simple">
                            { config.scheduleMode === "simple" && (
                                <>
                                    <div className="items-start flex gap-2 justify-between">
                                        <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="run-every">
                                            Run every
                                        </Label>
                                        <Select
                                            onValueChange={(value) =>
                                                updateConfig("interval", Number(value))
                                            }
                                            value={String(config.interval)}
                                        >
                                            <SelectTrigger className="rounded-[4px] w-full">
                                                <SelectValue placeholder="Select a frequency" />
                                            </SelectTrigger>
                                            <SelectContent className="border-neutral-200">
                                                {Array.from({ length: 30 }, (_, index) => (
                                                    <SelectItem
                                                        key={index + 1}
                                                        value={String(index + 1)}
                                                    >
                                                        {String(index + 1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="items-start flex gap-2 justify-between">
                                        <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="interval">
                                            Interval
                                        </Label>
                                        <Select
                                            onValueChange={(value) =>
                                                updateConfig("timeUnit", value as TimeUnit)
                                            }
                                            value={config.timeUnit}
                                        >
                                            <SelectTrigger className="rounded-[4px] w-full" id="interval">
                                                <SelectValue placeholder="Select an interval" />
                                            </SelectTrigger>
                                            <SelectContent className="border-neutral-200">
                                                {timeUnits.map((unit) => (
                                                    <SelectItem key={unit.value} value={unit.value}>
                                                        {unit.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </TabsContent>

                        {/* Advanced Mode */}
                        <TabsContent className="flex flex-col gap-4" value="advanced">
                            { config.scheduleMode === "advanced" && (
                                <>
                                    <div className="items-start flex gap-2 justify-between">
                                        <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="timezone">
                                            Timezone
                                        </Label>
                                        <Select
                                            onValueChange={(value) =>
                                                updateConfig("timezone", value)
                                            }
                                            value={config.timezone}
                                        >
                                            <SelectTrigger className="rounded-[4px] truncate w-full" id="timezone">
                                                <SelectValue placeholder="Select a timezone" />
                                            </SelectTrigger>
                                            <SelectContent className="border-neutral-200">
                                                <SelectItem value="UTC-06:00">(UTC-06:00) Central Time (US and Canada)</SelectItem>
                                                <SelectItem value="UTC-05:00">(UTC-05:00) Eastern Time (US and Canada)</SelectItem>
                                                <SelectItem value="UTC-04:00">(UTC-04:00) Atlantic Time (Canada)</SelectItem>
                                                <SelectItem value="UTC-03:00">(UTC-03:00) Brazil, Buenos Aires</SelectItem>
                                                <SelectItem value="UTC-02:00">(UTC-02:00) Mid-Atlantic</SelectItem>
                                                <SelectItem value="UTC-01:00">(UTC-01:00) Azores</SelectItem>
                                                <SelectItem value="UTC+00:00">(UTC+00:00) Greenwich Mean Time</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="items-start flex gap-2 justify-between">
                                        <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="interval">
                                            Interval
                                        </Label>
                                        <Select
                                            disabled={config.useCronExpression}
                                            onValueChange={(value) =>
                                                updateConfig("timeUnit", value as TimeUnit)
                                            }
                                            value={config.timeUnit}
                                        >
                                            <SelectTrigger className="rounded-[4px] w-full" id="interval">
                                                <SelectValue placeholder="Select an interval" />
                                            </SelectTrigger>
                                            <SelectContent className="border-neutral-200">
                                                {timeUnits.map((unit) => (
                                                    <SelectItem key={unit.value} value={unit.value}>
                                                        {unit.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="items-start flex gap-2 justify-between">
                                        <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="minutes">
                                            Minutes
                                        </Label>
                                        <Select
                                            disabled={config.useCronExpression}
                                            onValueChange={(value) =>
                                                updateConfig("minute", Number(value))
                                            }
                                            value={String(config.minute)}
                                        >
                                            <SelectTrigger className="rounded-[4px] w-full" id="minutes">
                                                <SelectValue placeholder="Select minutes" />
                                            </SelectTrigger>
                                            <SelectContent className="border-neutral-200">
                                                {Array.from({ length: 60 }, (_, index) => (
                                                    <SelectItem key={index} value={String(index)}>
                                                        {String(index).padStart(2, "0")}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="items-start flex gap-2 justify-between">
                                        <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="hours">
                                            Hours
                                        </Label>
                                        <Select
                                            disabled={config.useCronExpression}
                                            onValueChange={(value) =>
                                                updateConfig("hour", Number(value))
                                            }
                                            value={String(config.hour)}
                                        >
                                            <SelectTrigger className="rounded-[4px] w-full" id="hours">
                                                <SelectValue placeholder="Select hours" />
                                            </SelectTrigger>
                                            <SelectContent className="border-neutral-200">
                                                {Array.from({ length: 24 }, (_, index) => (
                                                    <SelectItem key={index} value={String(index)}>
                                                        {String(index).padStart(2, "0")}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="items-start flex gap-2 justify-between">
                                        <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="use-cron-expression">
                                            Use cron expression
                                        </Label>
                                        <div className="items-start flex flex-col gap-2 w-full">
                                            <Toggle
                                                className="data-[state=on]:bg-black/4 data-[state=on]:border-gray-600 rounded-[4px]"
                                                id="use-cron-expression"
                                                onPressedChange={(pressed) =>
                                                    updateConfig("useCronExpression", pressed)
                                                }
                                                pressed={config.useCronExpression}
                                                size="sm"
                                                variant="outline"
                                            >
                                                {config.useCronExpression ? (
                                                    <Check className="text-gray-600 h-4 w-4" />
                                                ) : (
                                                    <div className="border rounded-[4px] size-4" />
                                                )}
                                                Show cron expression
                                            </Toggle>
                                            {config.useCronExpression && (
                                                <Input
                                                    className="rounded-[4px]"
                                                    onChange={(e) =>
                                                        updateConfig("cronExpression", e.target.value)
                                                    }
                                                    placeholder="Enter a cron expression"
                                                    type="text"
                                                    value={config.cronExpression || (config.hour || config.minute ? `${config.minute} ${config.hour} * * *` : "0 0 * * *")}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            )}

            <Separator />

            <div className="flex gap-2 justify-between">
                <span className="text-sm font-semibold mt-1.5 min-w-[144px]">Trigger conditions</span>
                <ButtonGroup>
                    <Button
                        className="border-neutral-200 rounded-[4px]"
                        onClick={() => {
                            setConfig({
                                ...config,
                                conditions: [...config.conditions, { id: crypto.randomUUID(), label: `Condtion ${config.conditions.length + 1}`, type: "sql", value: "" }],
                            });
                        }}
                        variant="outline"
                    >
                        Add trigger condition
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="border-neutral-200 rounded-[4px]" variant="outline">
                                <Ellipsis className="text-neutral-600 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-neutral-200">
                            <DropdownMenuItem onClick={() => onBrowseConditions?.()}>
                                Browse trigger conditions
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ButtonGroup>
            </div>

            {/* Trigger Conditions */}
            {config.conditions.length > 0 && (
                <div className="flex flex-col gap-4">
                    {config.conditions.map((condition) => (
                        <Condition
                            key={condition.id}
                            onChange={(newValue) => {
                                setConfig({
                                    ...config,
                                    conditions: config.conditions.map((c) =>
                                        c.id === condition.id ? { ...c, value: newValue } : c
                                    ),
                                });
                            }}
                            onDelete={() => {
                                setConfig({
                                    ...config,
                                    conditions: config.conditions.filter((c) => c.label !== condition.label),
                                });
                            }}
                            onRun={() => {
                                setConfig({
                                    ...config,
                                    conditions: config.conditions.map((c) =>
                                        c.id === condition.id ? { ...c, isRunning: true } : c
                                    ),
                                });
                                setTimeout(() => {
                                    setConfig({
                                        ...config,
                                        conditions: config.conditions.map((c) =>
                                            c.id === condition.id ? { ...c, isRunning: false } : c
                                        ),
                                    });
                                }, 3000);
                            }}
                            onTypeChange={(type) => {
                                setConfig({
                                    ...config,
                                    conditions: config.conditions.map((c) =>
                                        c.id === condition.id ? { ...c, type } : c
                                    ),
                                });
                            }}
                            {...condition}
                        />
                    ))}
                </div>
            )}

            {/* Debug: Config */}
            {debug && (
                <pre className="text-xs bg-gray-100 p-2 rounded">
                    {JSON.stringify(config, null, 2)}
                </pre>
            )}
        </div>
    );
}

export type { TriggerConfig };
