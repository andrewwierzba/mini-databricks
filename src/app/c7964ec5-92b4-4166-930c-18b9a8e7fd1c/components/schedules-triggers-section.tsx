"use client";

import { useState } from "react";

import { ChevronDown, ChevronRight, Pause } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SchedulesTriggersSectionProps {
	schedule?: string;
	timezone?: string;
	triggerConditions?: string;
	triggerCount?: number;
}

const defaultProps: SchedulesTriggersSectionProps = {
	schedule: "Every 1 day",
	timezone: "UTC+02:00 Amsterdam",
	triggerConditions: "SQL",
	triggerCount: 2,
};

export function SchedulesTriggersSection({
	schedule = defaultProps.schedule,
	timezone = defaultProps.timezone,
	triggerConditions = defaultProps.triggerConditions,
	triggerCount = defaultProps.triggerCount,
}: SchedulesTriggersSectionProps) {
	const [isExpanded, setIsExpanded] = useState(true);

	return (
		<div className="border-b border-gray-200">
			{/* Section Header */}
			<button
				className="flex items-center gap-2 justify-between px-4 py-3 w-full hover:bg-gray-50"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex items-center gap-2">
					{isExpanded ? (
						<ChevronDown className="h-4 text-gray-500 w-4" />
					) : (
						<ChevronRight className="h-4 text-gray-500 w-4" />
					)}
					<span className="font-medium text-sm">Schedules & triggers</span>
				</div>
			</button>

			{/* Section Content */}
			{isExpanded && (
				<div className="flex flex-col gap-3 pb-4 px-4">
					{/* Schedule Info */}
					<div className="flex flex-col gap-1">
						<span className="text-sm">
							{schedule} ({timezone})
						</span>
					</div>

					{/* Trigger Conditions */}
					<div className="flex items-center gap-2">
						<span className="text-gray-500 text-sm">Trigger condit...</span>
						<span className="bg-blue-100 px-2 py-0.5 rounded text-blue-700 text-sm">
							{triggerConditions}: {triggerCount}
						</span>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2">
						<Button className="h-8 text-sm" size="sm" variant="outline">
							Edit trigger
						</Button>
						<Button className="h-8 text-sm" size="sm" variant="outline">
							<Pause className="h-3 mr-1 w-3" />
							Pause
						</Button>
						<Button className="h-8 text-sm" size="sm" variant="outline">
							Delete
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
