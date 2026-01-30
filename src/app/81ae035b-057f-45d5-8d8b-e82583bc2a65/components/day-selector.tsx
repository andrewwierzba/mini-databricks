"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type Day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

interface DaySelectorProps {
    onChange: (days: Day[]) => void;
    value: Day[];
}

const DAYS: { value: Day; label: string; short: string }[] = [
    { value: "sunday", label: "Sunday", short: "S" },
    { value: "monday", label: "Monday", short: "M" },
    { value: "tuesday", label: "Tuesday", short: "T" },
    { value: "wednesday", label: "Wednesday", short: "W" },
    { value: "thursday", label: "Thursday", short: "T" },
    { value: "friday", label: "Friday", short: "F" },
    { value: "saturday", label: "Saturday", short: "S" },
];

export function DaySelector({ onChange, value }: DaySelectorProps) {
    return (
        <ToggleGroup
            onValueChange={(days: Day[]) => onChange(days)}
            spacing={1.5}
            type="multiple"
            value={value}
        >
            {DAYS.map((day) => (
                <Tooltip key={day.value}>
                    <ToggleGroupItem
                        asChild
                        className="data-[state=on]:bg-blue-600/10 data-[state=on]:border-blue-800 data-[state=on]:text-blue-800 min-w-10"
                        value={day.value}
                        variant="outline"
                    >
                        <TooltipTrigger>
                            {day.short}
                        </TooltipTrigger>
                    </ToggleGroupItem>
                    <TooltipContent>{day.label}</TooltipContent>
                </Tooltip>
            ))}
        </ToggleGroup>
    );
}
