"use client";

import { useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface Parameter {
	name: string;
	value: string;
}

interface JobParametersSectionProps {
	parameters?: Parameter[];
}

const defaultParameters: Parameter[] = [
	{ name: "Param1", value: "Value 1" },
	{ name: "Param2", value: "Value 2" },
];

export function JobParametersSection({
	parameters = defaultParameters,
}: JobParametersSectionProps) {
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
					<span className="font-medium text-sm">Job parameters</span>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<span className="cursor-help text-gray-400 text-xs">ⓘ</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>Parameters passed to the job at runtime</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</button>

			{/* Section Content */}
			{isExpanded && (
				<div className="flex flex-col gap-3 pb-4 px-4">
					{/* Parameters List */}
					<div className="flex flex-col gap-2">
						{parameters.map((param) => (
							<div
								className="flex items-center justify-between"
								key={param.name}
							>
								<span className="text-gray-500 text-sm">{param.name}</span>
								<span className="text-sm">{param.value}</span>
							</div>
						))}
					</div>

					{/* Edit Button */}
					<Button className="h-8 text-sm w-fit" size="sm" variant="outline">
						Edit parameters
					</Button>
				</div>
			)}
		</div>
	);
}
