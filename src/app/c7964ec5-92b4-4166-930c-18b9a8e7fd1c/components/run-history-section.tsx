"use client";

import { useState } from "react";

import { AlertCircle, CheckCircle2, ChevronDown, ChevronRight, Clock, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface RunHistoryItem {
	duration: string;
	runId: string;
	startTime: string;
	status: "success" | "failed" | "running" | "pending";
}

interface RunHistorySectionProps {
	runs?: RunHistoryItem[];
}

const defaultRuns: RunHistoryItem[] = [
	{
		duration: "2m 34s",
		runId: "run-001",
		startTime: "2024-01-29 10:30:00",
		status: "success",
	},
	{
		duration: "2m 18s",
		runId: "run-002",
		startTime: "2024-01-28 10:30:00",
		status: "success",
	},
	{
		duration: "3m 45s",
		runId: "run-003",
		startTime: "2024-01-27 10:30:00",
		status: "failed",
	},
	{
		duration: "2m 22s",
		runId: "run-004",
		startTime: "2024-01-26 10:30:00",
		status: "success",
	},
];

const getStatusIcon = (status: RunHistoryItem["status"]) => {
	switch (status) {
		case "success":
			return <CheckCircle2 className="h-4 text-green-600 w-4" />;
		case "failed":
			return <XCircle className="h-4 text-red-600 w-4" />;
		case "running":
			return <Clock className="h-4 text-blue-600 w-4" />;
		case "pending":
			return <AlertCircle className="h-4 text-gray-400 w-4" />;
	}
};

const getStatusBadge = (status: RunHistoryItem["status"]) => {
	switch (status) {
		case "success":
			return (
				<Badge className="bg-green-100 hover:bg-green-100 text-green-700" variant="secondary">
					Success
				</Badge>
			);
		case "failed":
			return (
				<Badge className="bg-red-100 hover:bg-red-100 text-red-700" variant="secondary">
					Failed
				</Badge>
			);
		case "running":
			return (
				<Badge className="bg-blue-100 hover:bg-blue-100 text-blue-700" variant="secondary">
					Running
				</Badge>
			);
		case "pending":
			return (
				<Badge className="bg-gray-100 hover:bg-gray-100 text-gray-700" variant="secondary">
					Pending
				</Badge>
			);
	}
};

export function RunHistorySection({ runs = defaultRuns }: RunHistorySectionProps) {
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
					<span className="font-medium text-sm">Run history</span>
				</div>
			</button>

			{/* Section Content */}
			{isExpanded && (
				<div className="flex flex-col gap-2 pb-4 px-4">
					{runs.map((run) => (
						<div
							className="border border-gray-200 flex flex-col gap-2 p-3 rounded-lg hover:border-gray-300"
							key={run.runId}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{getStatusIcon(run.status)}
									<span className="font-mono text-xs">{run.runId}</span>
								</div>
								{getStatusBadge(run.status)}
							</div>
							<div className="flex flex-col gap-1 text-xs">
								<div className="flex items-center justify-between text-gray-500">
									<span>Started</span>
									<span>{run.startTime}</span>
								</div>
								<div className="flex items-center justify-between text-gray-500">
									<span>Duration</span>
									<span>{run.duration}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
