"use client";

import { useState } from "react";

import { Activity, ChevronDown, ChevronRight, Database, Zap } from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface PerformanceMetric {
	label: string;
	tooltip?: string;
	trend?: "up" | "down" | "stable";
	unit?: string;
	value: string;
}

interface PerformanceMetricsSectionProps {
	metrics?: PerformanceMetric[];
}

const defaultMetrics: PerformanceMetric[] = [
	{
		label: "Avg. execution time",
		tooltip: "Average time to complete job execution",
		trend: "down",
		unit: "min",
		value: "2.5",
	},
	{
		label: "CPU utilization",
		tooltip: "Average CPU usage during execution",
		trend: "stable",
		unit: "%",
		value: "68",
	},
	{
		label: "Memory usage",
		tooltip: "Peak memory consumption",
		trend: "up",
		unit: "GB",
		value: "4.2",
	},
	{
		label: "Data processed",
		tooltip: "Total volume of data processed",
		unit: "GB",
		value: "125",
	},
];

const getTrendIcon = (trend?: "up" | "down" | "stable") => {
	if (!trend) return null;

	switch (trend) {
		case "up":
			return <span className="text-red-500 text-xs">↑</span>;
		case "down":
			return <span className="text-green-500 text-xs">↓</span>;
		case "stable":
			return <span className="text-gray-500 text-xs">→</span>;
	}
};

export function PerformanceMetricsSection({
	metrics = defaultMetrics,
}: PerformanceMetricsSectionProps) {
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
					<span className="font-medium text-sm">Performance metrics</span>
				</div>
			</button>

			{/* Section Content */}
			{isExpanded && (
				<div className="flex flex-col gap-3 pb-4 px-4">
					{/* Metrics Grid */}
					<div className="flex flex-col gap-3">
						{metrics.map((metric) => (
							<div
								className="flex items-center justify-between"
								key={metric.label}
							>
								<div className="flex items-center gap-1">
									<span className="text-gray-500 text-sm">{metric.label}</span>
									{metric.tooltip && (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger>
													<span className="cursor-help text-gray-400 text-xs">
														ⓘ
													</span>
												</TooltipTrigger>
												<TooltipContent>
													<p>{metric.tooltip}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
								</div>
								<div className="flex items-center gap-1">
									<span className="font-medium text-sm">
										{metric.value}
										{metric.unit && (
											<span className="ml-1 text-gray-500">{metric.unit}</span>
										)}
									</span>
									{getTrendIcon(metric.trend)}
								</div>
							</div>
						))}
					</div>

					{/* Quick Stats */}
					<div className="bg-gray-50 flex gap-3 mt-2 p-3 rounded-lg">
						<div className="flex flex-1 flex-col items-center justify-center gap-1">
							<Zap className="h-4 text-blue-600 w-4" />
							<span className="font-medium text-sm">98.5%</span>
							<span className="text-gray-500 text-xs">Success rate</span>
						</div>
						<div className="border-gray-200 border-l" />
						<div className="flex flex-1 flex-col items-center justify-center gap-1">
							<Activity className="h-4 text-green-600 w-4" />
							<span className="font-medium text-sm">24/7</span>
							<span className="text-gray-500 text-xs">Uptime</span>
						</div>
						<div className="border-gray-200 border-l" />
						<div className="flex flex-1 flex-col items-center justify-center gap-1">
							<Database className="h-4 text-purple-600 w-4" />
							<span className="font-medium text-sm">1.2TB</span>
							<span className="text-gray-500 text-xs">Total data</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
