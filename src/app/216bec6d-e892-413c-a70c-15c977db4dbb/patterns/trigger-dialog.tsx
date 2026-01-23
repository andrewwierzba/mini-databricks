"use client";

import { useEffect, useRef, useState } from "react";

import { ArrowLeft, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/216bec6d-e892-413c-a70c-15c977db4dbb/components/dialog";

import TriggerForm, { TriggerConfig } from "@/app/216bec6d-e892-413c-a70c-15c977db4dbb/forms/trigger-form";
import { Condition as ConditionPreview, ConditionProps } from "@/app/216bec6d-e892-413c-a70c-15c977db4dbb/components/conditions";

const exampleSQLTriggers: ConditionProps[] = [
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
    onOpenChange?: (open: boolean) => void;
    onSubmit?: (config: TriggerConfig) => void;
}

export default function TriggerDialog({ open, onOpenChange, onSubmit, resetTrigger }: TriggerDialogProps) {
    const [depth, setDepth] = useState(0);
    const [triggerConfig, setTriggerConfig] = useState<TriggerConfig | null>(null);
    const formConfigRef = useRef<TriggerConfig | null>(null);
    const lastResetRef = useRef<number>(0);

    useEffect(() => {
        if (resetTrigger && resetTrigger !== lastResetRef.current) {
            setTriggerConfig(null);
            formConfigRef.current = null;
            setDepth(0);
            lastResetRef.current = resetTrigger;
        }
    }, [resetTrigger]);

    const handleConditionSelect = (condition: ConditionProps) => {
        const newCondition = {
            id: crypto.randomUUID(),
            label: condition.label,
            type: condition.type,
            value: condition.value,
        };
        
        const currentConfig = formConfigRef.current || triggerConfig;
        
        if (currentConfig) {
            const updatedConfig = {
                ...currentConfig,
                conditions: [...currentConfig.conditions, newCondition],
            };
            setTriggerConfig(updatedConfig);
            formConfigRef.current = updatedConfig;
        } else {
            const defaultConfig: TriggerConfig = {
                status: true,
                type: "schedule",
                scheduleMode: "simple",
                interval: 1,
                timeUnit: "day",
                conditions: [newCondition],
            };
            setTriggerConfig(defaultConfig);
            formConfigRef.current = defaultConfig;
        }
        setDepth(0);
    };

    return (
        <Dialog
            defaultDepth={depth}
            onOpenChange={onOpenChange}
            open={open}
            setDepth={setDepth}
        >
            <DialogTrigger asChild>
                <Button className="m-auto" variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-scroll">
                <DialogHeader>
                    {depth === 0 && (
                        <div className="items-center flex gap-2 justify-between">
                            <DialogTitle>New trigger</DialogTitle>
                            <DialogClose asChild>
                                <Button
                                    className="rounded-[4px] text-gray-600 h-8 p-2 w-8"
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
                                className="rounded-[4px] text-gray-600 h-8 p-2 w-8"
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
                <div className="flex flex-col gap-4">
                    {depth === 0 && (
                        <TriggerForm
                            initialConfig={triggerConfig || undefined}
                            onBrowseConditions={() => setDepth(1)}
                            onChange={(config) => {
                                setTriggerConfig(config);
                                formConfigRef.current = config;
                            }}
                            onSubmit={(config) => {
                                onSubmit?.(config);
                                onOpenChange?.(false);
                            }}
                        />
                    )}

                    {depth === 1 && (
                        <>
                            <div className="items-center flex gap-2">
                                <InputGroup>
                                    <InputGroupInput placeholder="Search" />
                                    <InputGroupAddon>
                                        <Search className="h-4 w-4" />
                                    </InputGroupAddon>
                                </InputGroup>
                                <Select>
                                    <SelectTrigger className="rounded-[4px] min-w-[192px] truncate">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent className="border-neutral-200">
                                        <SelectItem value="all">All categories</SelectItem>
                                        <SelectItem value="job">Job</SelectItem>
                                        <SelectItem value="schedule">Schedule</SelectItem>
                                        <SelectItem value="table">Table</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col">
                                {exampleSQLTriggers.length > 0 && (
                                    exampleSQLTriggers.map((condition: ConditionProps) => (
                                        <ConditionPreview key={condition.label} onClick={handleConditionSelect} {...condition} />
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter>
                    {depth === 0 && (
                        <>
                            <DialogClose asChild>
                                <Button className="border-neutral-200 rounded-[4px]" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 rounded-[4px]"
                                onClick={() => {
                                    const configToSubmit = formConfigRef.current || triggerConfig;
                                    if (configToSubmit) {
                                        onSubmit?.(configToSubmit);
                                        onOpenChange?.(false);
                                    }
                                }}
                            >
                                Create
                            </Button>
                        </>
                    )}

                    {depth === 1 && (
                        <>
                            <Button
                                className="border-neutral-200 rounded-[4px]"
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
