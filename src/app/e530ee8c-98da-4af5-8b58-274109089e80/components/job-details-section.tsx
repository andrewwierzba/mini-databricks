"use client";

import { useState } from "react";

import { ChevronDown, ChevronRight, Copy, ExternalLink, Pencil } from "lucide-react";

import { Avatar } from "@databricks/design-system";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface JobDetailsData {
	creator: string;
	description?: string;
	jobId: string;
	lineageInfo?: string;
	performanceEnabled: boolean;
	runAs: string;
}

interface JobDetailsSectionProps {
	data?: JobDetailsData;
}

const defaultData: JobDetailsData = {
	creator: "name.surname@comp...",
	jobId: "93353565471675",
	performanceEnabled: true,
	runAs: "name.surname@c...",
};

export function JobDetailsSection({ data = defaultData }: JobDetailsSectionProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [performanceEnabled, setPerformanceEnabled] = useState(data.performanceEnabled);

	const handleCopyJobId = () => {
		navigator.clipboard.writeText(data.jobId);
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
					<span className="font-medium text-sm">Job details</span>
				</div>
				<Button
					className="h-6 w-6"
					onClick={(e) => e.stopPropagation()}
					size="icon"
					variant="ghost"
				>
					<ExternalLink className="h-4 w-4" />
				</Button>
			</button>

			{/* Section Content */}
			{isExpanded && (
				<div className="flex flex-col gap-3 pb-4 px-4">
					{/* Job ID */}
					<div className="flex items-start justify-between">
						<span className="text-gray-500 text-sm">Job ID</span>
						<div className="flex items-center gap-1">
							<span className="font-mono text-sm">{data.jobId}</span>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											className="h-6 w-6"
											onClick={handleCopyJobId}
											size="icon"
											variant="ghost"
										>
											<Copy className="h-3 w-3" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Copy Job ID</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>

					{/* Creator */}
					<div className="flex items-center justify-between">
						<span className="text-gray-500 text-sm">Creator</span>
						<div className="flex items-center gap-2">
							<Avatar
								aria-label="Creator"
								label={data.creator.charAt(0).toUpperCase()}
								size="sm"
								type="user"
							/>
							<span className="text-sm">{data.creator}</span>
						</div>
					</div>

					{/* Run as */}
					<div className="flex items-center justify-between">
						<span className="text-gray-500 text-sm">Run as</span>
						<div className="flex items-center gap-2">
							<Avatar
								aria-label="Run as"
								label={data.runAs.charAt(0).toUpperCase()}
								size="sm"
								type="user"
							/>
							<span className="text-sm">{data.runAs}</span>
							<Button className="h-6 w-6" size="icon" variant="ghost">
								<Pencil className="h-3 w-3" />
							</Button>
						</div>
					</div>

					{/* Description */}
					<div className="flex items-center justify-between">
						<span className="text-gray-500 text-sm">Description</span>
						<Button className="h-7 text-sm" size="sm" variant="outline">
							Add description
						</Button>
					</div>

					{/* Lineage */}
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-1">
							<span className="text-gray-500 text-sm">Lineage</span>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<span className="cursor-help text-gray-400 text-xs">ⓘ</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>Data lineage information</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<div className="flex flex-col items-end text-right">
							<span className="text-gray-500 text-sm">
								No lineage information for this job.
							</span>
							<a
								className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
								href="#"
							>
								Learn more
								<ExternalLink className="h-3 w-3" />
							</a>
						</div>
					</div>

					{/* Performance */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1">
							<span className="text-gray-500 text-sm">Performan...</span>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<span className="cursor-help text-gray-400 text-xs">ⓘ</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>Performance optimization settings</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<Switch
							checked={performanceEnabled}
							onCheckedChange={setPerformanceEnabled}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
