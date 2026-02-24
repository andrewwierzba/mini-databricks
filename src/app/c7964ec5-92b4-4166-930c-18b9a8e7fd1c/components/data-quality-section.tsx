"use client";

import { useState } from "react";

import {
	AlertTriangle,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Info,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface QualityCheck {
	description: string;
	lastChecked: string;
	name: string;
	severity: "critical" | "warning" | "info" | "passed";
	status: "passed" | "failed" | "warning";
}

interface DataQualitySectionProps {
	checks?: QualityCheck[];
}

const defaultChecks: QualityCheck[] = [
	{
		description: "All required fields contain valid data",
		lastChecked: "5 min ago",
		name: "Null value check",
		severity: "passed",
		status: "passed",
	},
	{
		description: "Data format matches expected schema",
		lastChecked: "5 min ago",
		name: "Schema validation",
		severity: "passed",
		status: "passed",
	},
	{
		description: "Duplicate records detected in primary key",
		lastChecked: "5 min ago",
		name: "Duplicate detection",
		severity: "warning",
		status: "warning",
	},
	{
		description: "Data freshness within acceptable range",
		lastChecked: "5 min ago",
		name: "Freshness check",
		severity: "passed",
		status: "passed",
	},
];

const getStatusIcon = (severity: QualityCheck["severity"]) => {
	switch (severity) {
		case "passed":
			return <CheckCircle2 className="h-4 text-green-600 w-4" />;
		case "warning":
			return <AlertTriangle className="h-4 text-yellow-600 w-4" />;
		case "critical":
			return <AlertTriangle className="h-4 text-red-600 w-4" />;
		case "info":
			return <Info className="h-4 text-blue-600 w-4" />;
	}
};

const getStatusBadge = (severity: QualityCheck["severity"]) => {
	switch (severity) {
		case "passed":
			return (
				<Badge className="bg-green-100 hover:bg-green-100 text-green-700" variant="secondary">
					Passed
				</Badge>
			);
		case "warning":
			return (
				<Badge className="bg-yellow-100 hover:bg-yellow-100 text-yellow-700" variant="secondary">
					Warning
				</Badge>
			);
		case "critical":
			return (
				<Badge className="bg-red-100 hover:bg-red-100 text-red-700" variant="secondary">
					Critical
				</Badge>
			);
		case "info":
			return (
				<Badge className="bg-blue-100 hover:bg-blue-100 text-blue-700" variant="secondary">
					Info
				</Badge>
			);
	}
};

export function DataQualitySection({ checks = defaultChecks }: DataQualitySectionProps) {
	const [isExpanded, setIsExpanded] = useState(true);

	const passedCount = checks.filter((c) => c.severity === "passed").length;
	const warningCount = checks.filter((c) => c.severity === "warning").length;
	const criticalCount = checks.filter((c) => c.severity === "critical").length;

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
					<span className="font-medium text-sm">Data quality</span>
				</div>
				<div className="flex gap-1">
					{passedCount > 0 && (
						<Badge className="bg-green-100 h-5 px-1.5 text-green-700 text-xs" variant="secondary">
							{passedCount}
						</Badge>
					)}
					{warningCount > 0 && (
						<Badge className="bg-yellow-100 h-5 px-1.5 text-yellow-700 text-xs" variant="secondary">
							{warningCount}
						</Badge>
					)}
					{criticalCount > 0 && (
						<Badge className="bg-red-100 h-5 px-1.5 text-red-700 text-xs" variant="secondary">
							{criticalCount}
						</Badge>
					)}
				</div>
			</button>

			{/* Section Content */}
			{isExpanded && (
				<div className="flex flex-col gap-2 pb-4 px-4">
					{checks.map((check) => (
						<div
							className="border border-gray-200 flex gap-3 p-3 rounded-lg hover:border-gray-300"
							key={check.name}
						>
							<div className="flex-shrink-0 pt-0.5">{getStatusIcon(check.severity)}</div>
							<div className="flex flex-1 flex-col gap-2">
								<div className="flex items-start justify-between">
									<div className="flex flex-col gap-1">
										<span className="font-medium text-sm">{check.name}</span>
										<span className="text-gray-500 text-xs">
											{check.description}
										</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-400 text-xs">
										Checked {check.lastChecked}
									</span>
									{getStatusBadge(check.severity)}
								</div>
							</div>
						</div>
					))}

					{/* Summary Stats */}
					<div className="bg-gray-50 flex gap-3 mt-2 p-3 rounded-lg">
						<div className="flex flex-1 flex-col gap-1">
							<span className="font-medium text-sm">Quality score</span>
							<span className="text-2xl text-green-600">
								{Math.round((passedCount / checks.length) * 100)}%
							</span>
						</div>
						<div className="border-gray-200 border-l" />
						<div className="flex flex-1 flex-col gap-1">
							<span className="font-medium text-sm">Last checked</span>
							<span className="text-gray-600 text-sm">5 minutes ago</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
