"use client";

import Panel from "@/components/mini-patterns/panels/schedule";

import { TriggerProps } from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/trigger-dialog";

function formatScheduleIntervalSummary(trigger: TriggerProps): string {
    if (trigger.type !== "schedule" || trigger.scheduleMode !== "interval") return "";
    const interval = trigger.interval ?? 1;
    const unit = trigger.timeUnit ?? "day";
    const time = trigger.time;
    const minuteOffset = trigger.minuteOffset;
    const timezone = trigger.timezone;
    const weekDays = trigger.weekDays;
    const monthDays = trigger.monthDays;
    const plural = interval === 1 ? "" : "s";
    const unitLabel = unit.charAt(0).toUpperCase() + unit.slice(1) + plural;
    const tz = timezone ? ` (${timezone})` : "";
    if (unit === "minute") return `Every ${interval} minute${plural}`;
    if (unit === "hour") {
        if (minuteOffset != null && minuteOffset > 0) return `Every ${interval} hour${plural} at ${minuteOffset} minutes past${tz}`;
        return `Every ${interval} hour${plural}${tz}`;
    }
    if (unit === "day") {
        return time ? `Every ${interval} day${plural} at ${time.slice(0, 5)}${tz}` : `Every ${interval} day${plural}`;
    }
    if (unit === "week") {
        const daysStr = weekDays?.length ? ` on ${weekDays.join(", ")}` : "";
        return time ? `Every ${interval} week${plural}${daysStr} at ${time.slice(0, 5)}${tz}` : `Every ${interval} week${plural}${daysStr}`;
    }
    if (unit === "month") {
        const daysStr = monthDays?.length
            ? ` on ${monthDays.map((d) => {
                if (d === 0) return "last day of month";
                const n = d % 100;
                if (n >= 11 && n <= 13) return `${d}th`;
                if (d % 10 === 1) return `${d}st`;
                if (d % 10 === 2) return `${d}nd`;
                if (d % 10 === 3) return `${d}rd`;
                return `${d}th`;
            }).join(", ")}`
            : "";
        return time ? `Every ${interval} month${plural}${daysStr} at ${time.slice(0, 5)}${tz}` : `Every ${interval} month${plural}${daysStr}`;
    }
    return `Every ${interval} ${unitLabel}`;
}

interface Props {
    author: string;
    compute?: string;
    description?: string;
    id: string;
    trigger?: TriggerProps;
    onAddTrigger?: () => void;
    onDeleteTrigger?: () => void;
    onEditTrigger?: () => void;
}

export { formatScheduleIntervalSummary };

export default function Settings({
    author,
    compute,
    description,
    id,
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
        scheduleMode: trigger.type === "schedule" ? (trigger.scheduleMode === "cron" ? "advanced" as const : "simple" as const) : undefined,
        status: trigger.status,
        timeUnit: trigger.type === "schedule" ? trigger.timeUnit : undefined,
        timezone: trigger.type === "schedule" ? trigger.timezone : undefined,
        type: trigger.type,
    }] : [];

    return (
        <Panel
            advanced={{ maximumConcurrentRuns: 1, queue: true }}
            author={author}
            compute={compute ? [{ id: "compute-1", value: compute }] : undefined}
            description={description}
            id={id}
            triggers={triggers}
            onAddTrigger={onAddTrigger}
            onDeleteTrigger={onDeleteTrigger}
            onEditTrigger={onEditTrigger}
        />
    );
}
