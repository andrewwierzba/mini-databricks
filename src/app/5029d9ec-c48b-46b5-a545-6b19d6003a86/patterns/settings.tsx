"use client";

import Panel from "@/components/mini-patterns/panels/schedule";

import { TriggerProps } from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/trigger-dialog";

interface Props {
    author: string;
    compute?: string;
    description?: string;
    id: string;
    parameters?: { id: string; label: string; value: string }[];
    trigger?: TriggerProps;
    onAddTrigger?: () => void;
    onDeleteTrigger?: () => void;
    onEditTrigger?: () => void;
}

export default function Settings({
    author,
    compute,
    description,
    id,
    parameters,
    trigger,
    onAddTrigger,
    onDeleteTrigger,
    onEditTrigger,
}: Props) {
    const triggers = trigger ? [{
        cronExpression: trigger.type === "schedule" ? trigger.cronExpression : undefined,
        hour: trigger.type === "schedule" && trigger.time ? parseInt(trigger.time.slice(0, 2), 10) : undefined,
        id: trigger.id ?? "trigger-1",
        interval: trigger.type === "schedule" ? trigger.interval : undefined,
        minute: trigger.type === "schedule" && trigger.time ? parseInt(trigger.time.slice(3, 5), 10) : undefined,
        minuteOffset: trigger.type === "schedule" ? trigger.minuteOffset : undefined,
        monthDays: trigger.type === "schedule" ? trigger.monthDays : undefined,
        scheduleMode: trigger.type === "schedule" ? (trigger.cronExpression ? "advanced" as const : "simple" as const) : undefined,
        status: trigger.status,
        timeUnit: trigger.type === "schedule" ? trigger.timeUnit : undefined,
        timezone: trigger.type === "schedule" ? trigger.timezone : undefined,
        type: trigger.type,
        weekDays: trigger.type === "schedule" ? trigger.weekDays : undefined,
    }] : [];

    return (
        <Panel
            advanced={{ maximumConcurrentRuns: 1, queue: true }}
            author={author}
            compute={compute ? [{ id: "compute-1", value: compute }] : undefined}
            description={description}
            id={id}
            parameters={parameters}
            triggers={triggers}
            onAddTrigger={onAddTrigger}
            onDeleteTrigger={onDeleteTrigger}
            onEditTrigger={onEditTrigger}
        />
    );
}
