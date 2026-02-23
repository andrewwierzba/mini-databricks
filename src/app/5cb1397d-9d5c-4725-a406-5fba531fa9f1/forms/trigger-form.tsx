"use client";

import { useEffect, useState } from "react";

import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AdvancedOptionsSection } from "@/app/5cb1397d-9d5c-4725-a406-5fba531fa9f1/components/advanced-options-section";
import { Condition } from "@/app/5cb1397d-9d5c-4725-a406-5fba531fa9f1/components/condition";
import { DaySelector, type Day } from "@/app/5cb1397d-9d5c-4725-a406-5fba531fa9f1/components/day-selector";
import { TimeRangeInput } from "@/app/5cb1397d-9d5c-4725-a406-5fba531fa9f1/components/time-range-input";

// Types 
type TimeUnit = "HOURS" | "DAYS" | "WEEKS";
type TriggerType = "continuous" | "file-arrival" | "scheduled" | "table-update" | "manual";
type TableCondition = "ANY_UPDATED" | "ALL_UPDATED";

interface ConditionConfig {
    id: string;
    label: string;
    type: "sql" | "python";
    value: string;
}

interface ActivationWindow {
    days: Day[];
    enabled: boolean;
    endTime: string;
    startTime: string;
    timezone?: string;
}

interface BaseTriggerConfig {
    conditions: ConditionConfig[];
    status: boolean;
    type: TriggerType;
    activationWindow?: ActivationWindow;
}

interface ContinuousTriggerConfig extends BaseTriggerConfig {
    type: "continuous";
    taskRetryOnFailure?: boolean;
}

interface FileArrivalTriggerConfig extends BaseTriggerConfig {
    type: "file-arrival";
    storageLocation: string;
    minTimeBetweenTriggers?: number;
    waitAfterLastChange?: number;
}

interface TableUpdateTriggerConfig extends BaseTriggerConfig {
    type: "table-update";
    tableNames: string[];
    condition?: TableCondition;
    minTimeBetweenTriggers?: number;
    waitAfterLastChange?: number;
}

interface ManualTriggerConfig extends BaseTriggerConfig {
    type: "manual";
}

interface PeriodicScheduleConfig extends BaseTriggerConfig {
    interval: number;
    scheduleMode: "periodic";
    timeUnit: TimeUnit;
    type: "scheduled";
}

interface CronScheduleConfig extends BaseTriggerConfig {
    cronExpression: string;
    scheduleMode: "cron";
    timezone: string;
    type: "scheduled";
}

type TriggerConfig = ContinuousTriggerConfig | FileArrivalTriggerConfig | TableUpdateTriggerConfig | ManualTriggerConfig | PeriodicScheduleConfig | CronScheduleConfig;

type AllKeys<T> = T extends unknown ? keyof T : never;
type TriggerConfigKeys = AllKeys<TriggerConfig>;

// Constants 
const timeUnits: { value: TimeUnit; label: string; description: string }[] = [
    { value: "HOURS", label: "Hours", description: "Trigger every N hours" },
    { value: "DAYS", label: "Days", description: "Trigger every N days" },
    { value: "WEEKS", label: "Weeks", description: "Trigger every N weeks" },
];

const triggerTypes: { value: TriggerType; label: string; description: string }[] = [
    { value: "scheduled", label: "Scheduled", description: "Run on a time-based schedule" },
    { value: "continuous", label: "Continuous", description: "Always running—trigger another run when the current one completes" },
    { value: "file-arrival", label: "File arrival", description: "Run when new files arrive in a storage location" },
    { value: "table-update", label: "Table update", description: "Run when source tables are updated" },
    { value: "manual", label: "Manual", description: "Trigger runs manually only" },
];

const DEFAULT_ACTIVATION_WINDOW: ActivationWindow = {
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    enabled: false,
    endTime: "17:00",
    startTime: "09:00",
    timezone: "UTC",
};

const tableConditions: { value: TableCondition; label: string; description: string }[] = [
    { value: "ALL_UPDATED", label: "All tables updated", description: "Trigger only when all specified tables have been updated" },
    { value: "ANY_UPDATED", label: "Any table updated", description: "Trigger when any of the specified tables is updated" },
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
            if (initialConfig.type === "scheduled") {
                return {
                    status: true,
                    type: "scheduled",
                    scheduleMode: "periodic",
                    interval: 1,
                    timeUnit: "DAYS",
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
            type: "scheduled",
            scheduleMode: "periodic",
            interval: 1,
            timeUnit: "DAYS",
            conditions: [],
        } as TriggerConfig;
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

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
                <div className="flex flex-col gap-1 min-w-[144px]">
                    <Label className="font-semibold" htmlFor="status">Trigger status</Label>
                    <span className="text-neutral-600 text-xs">
                        Paused triggers will not start new job runs
                    </span>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-neutral-600 text-sm">
                        {config.status ? "Active" : "Paused"}
                    </span>
                    <Switch
                        checked={config.status}
                        className="data-[state=on]:bg-blue-600"
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
                <div className="flex flex-col gap-1 w-full">
                    <Select
                        onValueChange={(value) => {
                            const triggerType = value as TriggerType;
                            if (triggerType === "scheduled") {
                                setConfig({
                                    status: config.status,
                                    type: "scheduled",
                                    scheduleMode: "periodic",
                                    interval: 1,
                                    timeUnit: "DAYS",
                                    conditions: config.conditions,
                                });
                            } else if (triggerType === "continuous") {
                                setConfig({
                                    status: config.status,
                                    type: "continuous",
                                    conditions: config.conditions,
                                    taskRetryOnFailure: true,
                                });
                            } else if (triggerType === "file-arrival") {
                                setConfig({
                                    status: config.status,
                                    type: "file-arrival",
                                    storageLocation: "",
                                    conditions: config.conditions,
                                });
                            } else if (triggerType === "table-update") {
                                setConfig({
                                    status: config.status,
                                    type: "table-update",
                                    tableNames: [],
                                    condition: "ALL_UPDATED",
                                    conditions: config.conditions,
                                });
                            } else {
                                setConfig({
                                    status: config.status,
                                    type: "manual",
                                    conditions: config.conditions,
                                });
                            }
                        }}
                        value={config.type}
                    >
                        <SelectTrigger className="rounded-[4px] w-full" id="type">
                            <SelectValue placeholder="Select a trigger type" />
                        </SelectTrigger>
                        <SelectContent className="border-neutral-200">
                            {triggerTypes.map((trigger) => (
                                <SelectItem key={trigger.value} value={trigger.value}>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium">{trigger.label}</span>
                                        <span className="text-xs text-neutral-500">{trigger.description}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Scheduled Configuration */}
            {config.type === "scheduled" && (
                <div className="flex gap-2 justify-between relative">
                    <span className="text-sm font-semibold mt-1.5 min-w-[144px] absolute">Schedule type</span>
                    <Tabs
                        className="gap-4 w-full"
                        onValueChange={(value) => {
                            const mode = value as "periodic" | "cron";
                            if (mode === "periodic") {
                                setConfig({
                                    status: config.status,
                                    type: "scheduled",
                                    scheduleMode: "periodic",
                                    interval: 1,
                                    timeUnit: "DAYS",
                                    conditions: config.conditions,
                                    activationWindow: config.activationWindow,
                                });
                            } else {
                                setConfig({
                                    status: config.status,
                                    type: "scheduled",
                                    scheduleMode: "cron",
                                    timezone: "UTC",
                                    cronExpression: "0 0 * * *",
                                    conditions: config.conditions,
                                    activationWindow: config.activationWindow,
                                });
                            }
                        }}
                        value={config.scheduleMode}
                    >
                        <TabsList className="rounded-[4px] ml-[calc(144px+8px)] w-[calc(100%-144px-8px)]">
                            <TabsTrigger className="rounded-[4px]" value="periodic">
                                Periodic
                            </TabsTrigger>
                            <TabsTrigger className="rounded-[4px]" value="cron">
                                Cron
                            </TabsTrigger>
                        </TabsList>

                        {/* Periodic Mode */}
                        <TabsContent className="flex flex-col gap-4" value="periodic">
                            {config.scheduleMode === "periodic" && (
                                <>
                                    <div className="items-start flex gap-2 justify-between">
                                        <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="interval-value">
                                            Interval
                                        </Label>
                                        <div className="flex gap-2 w-full">
                                            <Input
                                                className="rounded-[4px]"
                                                id="interval-value"
                                                min={1}
                                                onChange={(e) =>
                                                    updateConfig("interval", Number(e.target.value))
                                                }
                                                placeholder="1"
                                                type="number"
                                                value={config.interval}
                                            />
                                            <Select
                                                onValueChange={(value) =>
                                                    updateConfig("timeUnit", value as TimeUnit)
                                                }
                                                value={config.timeUnit}
                                            >
                                                <SelectTrigger className="rounded-[4px] w-full">
                                                    <SelectValue placeholder="Select unit" />
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
                                    </div>
                                    <div className="text-xs text-neutral-500 ml-[calc(144px+8px)]">
                                        Run every {config.interval} {config.timeUnit.toLowerCase()}
                                    </div>
                                </>
                            )}
                        </TabsContent>

                        {/* Cron Mode */}
                        <TabsContent className="flex flex-col gap-4" value="cron">
                            {config.scheduleMode === "cron" && (
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
                                                <SelectItem value="UTC">UTC</SelectItem>
                                                <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                                                <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                                                <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                                                <SelectItem value="Europe/London">London</SelectItem>
                                                <SelectItem value="Europe/Paris">Paris</SelectItem>
                                                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="items-start flex gap-2 justify-between">
                                        <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="cron-expression">
                                            Cron expression
                                        </Label>
                                        <div className="flex flex-col gap-1 w-full">
                                            <Input
                                                className="rounded-[4px] font-mono text-sm"
                                                id="cron-expression"
                                                onChange={(e) =>
                                                    updateConfig("cronExpression", e.target.value)
                                                }
                                                placeholder="0 0 * * *"
                                                type="text"
                                                value={config.cronExpression}
                                            />
                                            <span className="text-xs text-neutral-500">
                                                Quartz Cron format (second minute hour day month weekday)
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            )}

            {/* Continuous Configuration */}
            {config.type === "continuous" && (
                <div className="flex gap-2 justify-between">
                    <Label className="font-semibold min-w-[144px]" htmlFor="task-retry">
                        Task retry on failure
                    </Label>
                    <div className="items-center flex gap-2">
                        <span className="text-neutral-600 text-sm">
                            {config.taskRetryOnFailure ? "Enabled" : "Disabled"}
                        </span>
                        <Switch
                            className="data-[state=on]:bg-blue-600"
                            checked={config.taskRetryOnFailure}
                            data-state={config.taskRetryOnFailure ? "on" : "off"}
                            id="task-retry"
                            onCheckedChange={(checked) =>
                                updateConfig("taskRetryOnFailure", checked)
                            }
                        />
                    </div>
                </div>
            )}

            {/* File Arrival Configuration */}
            {config.type === "file-arrival" && (
                <>
                    <div className="items-start flex gap-2 justify-between">
                        <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="storage-location">
                            Storage location <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-col gap-1 w-full">
                            <Input
                                className="rounded-[4px]"
                                id="storage-location"
                                onChange={(e) =>
                                    updateConfig("storageLocation", e.target.value)
                                }
                                placeholder="e.g., /mnt/data/incoming or abfss://container@storage.dfs.core.windows.net/path"
                                type="text"
                                value={config.storageLocation}
                            />
                            <span className="text-xs text-neutral-500">
                                Unity Catalog storage path to monitor for new files
                            </span>
                        </div>
                    </div>

                    <Button
                        className="border-neutral-200 rounded-[4px] w-fit ml-[calc(144px+8px)]"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        variant="ghost"
                        size="sm"
                    >
                        {showAdvanced ? "Hide" : "Show"} advanced options
                    </Button>

                    {showAdvanced && (
                        <>
                            <div className="items-start flex gap-2 justify-between">
                                <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="min-time-between">
                                    Min time between triggers
                                </Label>
                                <div className="flex flex-col gap-1 w-full">
                                    <Input
                                        className="rounded-[4px]"
                                        id="min-time-between"
                                        min={0}
                                        onChange={(e) =>
                                            updateConfig("minTimeBetweenTriggers", Number(e.target.value))
                                        }
                                        placeholder="0"
                                        type="number"
                                        value={config.minTimeBetweenTriggers ?? ""}
                                    />
                                    <span className="text-xs text-neutral-500">
                                        Minimum seconds to wait before triggering again
                                    </span>
                                </div>
                            </div>

                            <div className="items-start flex gap-2 justify-between">
                                <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="wait-after-change">
                                    Wait after last change
                                </Label>
                                <div className="flex flex-col gap-1 w-full">
                                    <Input
                                        className="rounded-[4px]"
                                        id="wait-after-change"
                                        min={0}
                                        onChange={(e) =>
                                            updateConfig("waitAfterLastChange", Number(e.target.value))
                                        }
                                        placeholder="0"
                                        type="number"
                                        value={config.waitAfterLastChange ?? ""}
                                    />
                                    <span className="text-xs text-neutral-500">
                                        Seconds to wait after detecting the last file change
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Table Update Configuration */}
            {config.type === "table-update" && (
                <>
                    <div className="items-start flex gap-2 justify-between">
                        <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="table-names">
                            Table names <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-col gap-1 w-full">
                            <Input
                                className="rounded-[4px]"
                                id="table-names"
                                onChange={(e) =>
                                    updateConfig("tableNames", e.target.value.split(",").map(t => t.trim()).filter(Boolean))
                                }
                                placeholder="catalog.schema.table1, catalog.schema.table2"
                                type="text"
                                value={config.tableNames.join(", ")}
                            />
                            <span className="text-xs text-neutral-500">
                                Comma-separated list of fully-qualified table names
                            </span>
                        </div>
                    </div>

                    {config.tableNames.length > 1 && (
                        <div className="items-start flex gap-2 justify-between">
                            <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="table-condition">
                                Condition
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    updateConfig("condition", value as TableCondition)
                                }
                                value={config.condition}
                            >
                                <SelectTrigger className="rounded-[4px] w-full" id="table-condition">
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent className="border-neutral-200">
                                    {tableConditions.map((cond) => (
                                        <SelectItem key={cond.value} value={cond.value}>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium">{cond.label}</span>
                                                <span className="text-xs text-neutral-500">{cond.description}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <Button
                        className="border-neutral-200 rounded-[4px] w-fit ml-[calc(144px+8px)]"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        variant="ghost"
                        size="sm"
                    >
                        {showAdvanced ? "Hide" : "Show"} advanced options
                    </Button>

                    {showAdvanced && (
                        <>
                            <div className="items-start flex gap-2 justify-between">
                                <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="min-time-between-table">
                                    Min time between triggers
                                </Label>
                                <div className="flex flex-col gap-1 w-full">
                                    <Input
                                        className="rounded-[4px]"
                                        id="min-time-between-table"
                                        min={0}
                                        onChange={(e) =>
                                            updateConfig("minTimeBetweenTriggers", Number(e.target.value))
                                        }
                                        placeholder="0"
                                        type="number"
                                        value={config.minTimeBetweenTriggers ?? ""}
                                    />
                                    <span className="text-xs text-neutral-500">
                                        Minimum seconds to wait before triggering again
                                    </span>
                                </div>
                            </div>

                            <div className="items-start flex gap-2 justify-between">
                                <Label className="font-semibold mt-2 min-w-[144px]" htmlFor="wait-after-change-table">
                                    Wait after last change
                                </Label>
                                <div className="flex flex-col gap-1 w-full">
                                    <Input
                                        className="rounded-[4px]"
                                        id="wait-after-change-table"
                                        min={0}
                                        onChange={(e) =>
                                            updateConfig("waitAfterLastChange", Number(e.target.value))
                                        }
                                        placeholder="0"
                                        type="number"
                                        value={config.waitAfterLastChange ?? ""}
                                    />
                                    <span className="text-xs text-neutral-500">
                                        Seconds to wait after detecting the last table update
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            <Separator />

            {/* Advanced Options */}
            <AdvancedOptionsSection defaultOpen={false} title="Advanced options">
                {/* Activation Window */}
                {config.type !== "manual" && (
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 justify-between">
                            <div className="flex flex-col gap-1 min-w-[144px]">
                                <Label className="font-semibold" htmlFor="activation-window-enabled">
                                    Activation window
                                </Label>
                                <span className="text-neutral-600 text-xs">
                                    Control when this trigger is allowed to start job runs
                                </span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-neutral-600 text-sm">
                                    {config.activationWindow?.enabled ? "Enabled" : "Disabled"}
                                </span>
                                <Switch
                                    checked={config.activationWindow?.enabled ?? false}
                                    className="data-[state=on]:bg-blue-600"
                                    data-state={config.activationWindow?.enabled ? "on" : "off"}
                                    id="activation-window-enabled"
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            updateConfig("activationWindow", DEFAULT_ACTIVATION_WINDOW);
                                        } else {
                                            updateConfig("activationWindow", {
                                                ...config.activationWindow,
                                                enabled: false,
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {config.activationWindow?.enabled && (
                            <>
                                <div className="flex gap-2 items-start justify-between">
                                    <Label className="font-semibold min-w-[144px] mt-2" htmlFor="activation-days">
                                        Days
                                    </Label>
                                    <DaySelector
                                        onChange={(days) =>
                                            updateConfig("activationWindow", {
                                                ...config.activationWindow!,
                                                days,
                                            })
                                        }
                                        value={config.activationWindow?.days ?? []}
                                    />
                                </div>

                                <div className="flex gap-2 items-start justify-between">
                                    <Label className="font-semibold min-w-[144px] mt-2" htmlFor="activation-time">
                                        Time range
                                    </Label>
                                    <TimeRangeInput
                                        endTime={config.activationWindow?.endTime ?? "17:00"}
                                        onEndTimeChange={(time) =>
                                            updateConfig("activationWindow", {
                                                ...config.activationWindow!,
                                                endTime: time,
                                            })
                                        }
                                        onStartTimeChange={(time) =>
                                            updateConfig("activationWindow", {
                                                ...config.activationWindow!,
                                                startTime: time,
                                            })
                                        }
                                        startTime={config.activationWindow?.startTime ?? "09:00"}
                                    />
                                </div>

                                <div className="flex gap-2 items-start justify-between">
                                    <Label className="font-semibold min-w-[144px] mt-2">
                                        Timezone
                                    </Label>
                                    <Select
                                        onValueChange={(value) =>
                                            updateConfig("activationWindow", {
                                                ...config.activationWindow!,
                                                timezone: value,
                                            })
                                        }
                                        value={config.activationWindow?.timezone ?? "UTC"}
                                    >
                                        <SelectTrigger className="rounded-[4px] truncate w-full">
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent className="border-neutral-200">
                                            <SelectItem value="UTC">UTC</SelectItem>
                                            <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                                            <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                                            <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                                            <SelectItem value="Europe/London">London</SelectItem>
                                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        <Separator />
                    </div>
                )}

                {/* Trigger Conditions */}
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2 justify-between">
                        <div className="min-w-[144px]">
                            <span className="font-semibold text-sm">Trigger conditions</span>
                            <p className="text-neutral-500 text-xs mt-1">
                                Runtime checks that must pass before starting a job
                            </p>
                        </div>
                        <ButtonGroup>
                            <Button
                                className="border-neutral-200 rounded-[4px]"
                                onClick={() => {
                                    setConfig({
                                        ...config,
                                        conditions: [...config.conditions, { id: crypto.randomUUID(), label: `Condition ${config.conditions.length + 1}`, type: "sql", value: "" }],
                                    });
                                }}
                                variant="outline"
                            >
                                Add condition
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="border-neutral-200 rounded-[4px]" variant="outline">
                                        <Ellipsis className="h-4 text-neutral-600 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="border-neutral-200">
                                    <DropdownMenuItem onClick={() => onBrowseConditions?.()}>
                                        Browse condition templates
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </ButtonGroup>
                    </div>

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
                </div>
            </AdvancedOptionsSection>

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

