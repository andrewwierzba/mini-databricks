"use client";

import { useState } from "react";

import { ArrowLeft, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/216bec6d-e892-413c-a70c-15c977db4dbb/components/dialog";

import TriggerForm from "@/app/216bec6d-e892-413c-a70c-15c977db4dbb/forms/trigger-form";
import { Condition as ConditionPreview, ConditionProps } from "@/app/216bec6d-e892-413c-a70c-15c977db4dbb/components/conditions";

const exampleSQLTriggers: ConditionProps[] = [
    {
        label: "New records detected",
        type: "sql",
        value: "SELECT COUNT(*) > 0 FROM sales WHERE created_at >= CURRENT_TIMESTAMP() - INTERVAL 1 HOUR"
    },
    {
        label: "Threshold exceeded",
        type: "sql",
        value: "SELECT SUM(amount) > 100000 FROM sales WHERE date = CURRENT_DATE()"
    },
    {
        label: "Data freshness check",
        type: "sql",
        value: "SELECT MAX(updated_at) < CURRENT_TIMESTAMP() - INTERVAL 24 HOURS FROM customer_data"
    },
    {
        label: "Anomaly detection",
        type: "sql",
        value: "SELECT COUNT(*) FROM transactions WHERE created_at >= CURRENT_TIMESTAMP() - INTERVAL 1 HOUR HAVING COUNT(*) > (SELECT AVG(hourly_count) * 2 FROM transaction_stats)"
    },
    {
        label: "Missing data validation",
        type: "sql",
        value: "SELECT COUNT(*) > 0 FROM orders WHERE customer_id IS NULL OR order_date IS NULL"
    },
    {
        label: "Duplicate detection",
        type: "sql",
        value: "SELECT COUNT(*) > 0 FROM (SELECT order_id, COUNT(*) as cnt FROM orders GROUP BY order_id HAVING COUNT(*) > 1)"
    },
    {
        label: "Performance metric alert",
        type: "sql",
        value: "SELECT COUNT(*) > 0 FROM query_logs WHERE execution_time_ms > 5000 AND created_at >= CURRENT_TIMESTAMP() - INTERVAL 1 HOUR"
    }
];

interface TriggerDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function TriggerDialog({ open, onOpenChange }: TriggerDialogProps) {
    const [depth, setDepth] = useState(0);

    const handleConditionSelect = (condition: ConditionProps) => {
        // Handle condition selection
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
            <DialogContent className="max-h-[90vh] max-w-[800px] sm:max-w-[600px] overflow-y-scroll">
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
                    {depth === 0 && <TriggerForm onBrowseConditions={() => setDepth(1)} />}

                    {depth === 1 && (
                        <>
                            <Input placeholder="Search" type="text" />
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
                                <Button className="rounded-[4px]" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button className="rounded-[4px]">Create</Button>
                        </>
                    )}

                    {depth === 1 && (
                        <>
                            <Button
                                className="rounded-[4px]"
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
