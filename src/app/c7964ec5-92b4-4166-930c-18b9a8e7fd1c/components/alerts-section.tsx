"use client";

import { useState } from "react";

import { Bell, ChevronDown, ChevronRight, Mail, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface AlertConfig {
	channel: "email" | "slack" | "pagerduty";
	enabled: boolean;
	type: string;
}

interface AlertsSectionProps {
	alerts?: AlertConfig[];
}

const defaultAlerts: AlertConfig[] = [
	{
		channel: "email",
		enabled: true,
		type: "On job failure",
	},
	{
		channel: "slack",
		enabled: true,
		type: "On job success",
	},
	{
		channel: "email",
		enabled: false,
		type: "On data quality issues",
	},
];

const getChannelIcon = (channel: AlertConfig["channel"]) => {
	switch (channel) {
		case "email":
			return <Mail className="h-3 w-3" />;
		case "slack":
			return <MessageSquare className="h-3 w-3" />;
		case "pagerduty":
			return <Bell className="h-3 w-3" />;
	}
};

export function AlertsSection({ alerts = defaultAlerts }: AlertsSectionProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [alertStates, setAlertStates] = useState(
		alerts.reduce(
			(acc, alert, idx) => {
				acc[idx] = alert.enabled;
				return acc;
			},
			{} as Record<number, boolean>,
		),
	);

	const handleToggle = (index: number) => {
		setAlertStates((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

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
					<span className="font-medium text-sm">Alerts & notifications</span>
				</div>
			</button>

			{/* Section Content */}
			{isExpanded && (
				<div className="flex flex-col gap-3 pb-4 px-4">
					{/* Alert Items */}
					<div className="flex flex-col gap-3">
						{alerts.map((alert, index) => (
							<div
								className="flex items-center justify-between"
								key={`${alert.type}-${alert.channel}`}
							>
								<div className="flex flex-col gap-1">
									<span className="text-sm">{alert.type}</span>
									<div className="flex items-center gap-1 text-gray-500 text-xs">
										{getChannelIcon(alert.channel)}
										<span className="capitalize">{alert.channel}</span>
									</div>
								</div>
								<Switch
									checked={alertStates[index]}
									onCheckedChange={() => handleToggle(index)}
								/>
							</div>
						))}
					</div>

					{/* Add Alert Button */}
					<Button className="h-8 text-sm w-fit" size="sm" variant="outline">
						<Bell className="h-3 mr-1 w-3" />
						Add alert
					</Button>
				</div>
			)}
		</div>
	);
}
