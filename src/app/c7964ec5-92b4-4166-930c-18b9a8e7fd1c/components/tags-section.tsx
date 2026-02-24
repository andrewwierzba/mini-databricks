"use client";

import { useState } from "react";

import { ChevronDown, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Tag {
	key: string;
	value: string;
}

interface TagsSectionProps {
	tags?: Tag[];
}

export function TagsSection({ tags = [] }: TagsSectionProps) {
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
					<span className="font-medium text-sm">Tags</span>
				</div>
			</button>

			{/* Section Content */}
			{isExpanded && (
				<div className="flex flex-col gap-3 pb-4 px-4">
					{tags.length === 0 ? (
						<div className="flex flex-col gap-2">
							<span className="text-gray-500 text-sm">No tags added</span>
							<Button className="h-8 text-sm w-fit" size="sm" variant="outline">
								<Plus className="h-3 mr-1 w-3" />
								Add tag
							</Button>
						</div>
					) : (
						<div className="flex flex-col gap-2">
							{tags.map((tag) => (
								<div
									className="flex items-center justify-between"
									key={tag.key}
								>
									<span className="text-gray-500 text-sm">{tag.key}</span>
									<span className="text-sm">{tag.value}</span>
								</div>
							))}
							<Button className="h-8 text-sm w-fit" size="sm" variant="outline">
								<Plus className="h-3 mr-1 w-3" />
								Add tag
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
