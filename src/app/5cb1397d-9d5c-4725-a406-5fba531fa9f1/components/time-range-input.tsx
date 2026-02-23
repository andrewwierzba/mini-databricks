"use client";

import { Input } from "@/components/ui/input";

interface TimeRangeInputProps {
    endTime: string;
    onEndTimeChange: (time: string) => void;
    onStartTimeChange: (time: string) => void;
    startTime: string;
}

export function TimeRangeInput({
    endTime,
    onEndTimeChange,
    onStartTimeChange,
    startTime,
}: TimeRangeInputProps) {
    return (
        <div className="items-center flex gap-2 w-full">
            <Input
                className="rounded-[4px] bg-background w-auto appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                id="time-start"
                onChange={(e) => onStartTimeChange(e.target.value)}
                step="1"
                type="time"
                value={startTime}
            />
            <span>-</span>
            <Input
                className="rounded-[4px] bg-background w-auto appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                id="time-end"
                onChange={(e) => onEndTimeChange(e.target.value)}
                step="1"
                type="time"
                value={endTime}
            />
        </div>
    );
}
