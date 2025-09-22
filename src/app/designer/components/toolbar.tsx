"use client"

import React from "react"

import {
	PlusIcon,
	SidebarIcon,
	TableIcon,
	TableLightningIcon,
	Typography
} from "@databricks/design-system"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ToolbarProps {
	onInputClick?: () => void;
	onTransformSelect?: (transformType: string) => void;
	onOutputClick?: () => void;
	onSQLClick?: () => void;
	version?: string;
	className?: string;
}

const versions = {
    v1: {
        options: ["input", "aggregate", "combine", "filter", "join", "sort", "transform", "output"]
    },
    v2: {
        options: ["input", "aggregate", "combine", "filter", "join", "sort", "select", "transform", "output"]
    }
}

const { Text } = Typography

export function Toolbar({
    className,
	onInputClick, 
	onTransformSelect, 
	onOutputClick, 
	onSQLClick,
	version = 'v1'
}: ToolbarProps) {
    return (
		<div
			aria-label="designer-canvas-toolbar"
			className={`${className || ''} rounded-sm shadow-xs inline-flex gap-1 ml-4 mt-4 p-1`}
			style={{
				backgroundColor: "var(--du-bois-color-background-primary)",
				border: `1px solid var(--du-bois-border)`
			}}
		>
			<div className="flex gap-2">
				<Button
					className="rounded-sm h-6 px-2 py-[2px]"
					onClick={onInputClick}
					size="sm"
					variant="ghost"
				>
					<TableIcon style={{ color: 'var(--du-bois-text-secondary)' }} />
					<Typography>
                        <Text>Input</Text>
                    </Typography>
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className="rounded-sm h-6 px-2 py-[2px]"
							size="sm"
							variant="ghost"
						>
							<PlusIcon style={{ color: 'var(--du-bois-text-secondary)' }} />
							<Typography>
                                <Text>Transform</Text>
                            </Typography>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
                        align="start"
                        className="rounded-sm"
                        sideOffset={8}
                    >
						{versions.v1.options.map((option) => {
							return (
								<DropdownMenuItem
									key={option}
									onClick={() => onTransformSelect}
								>
									{option}
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>
				<Button
					className="rounded-sm h-6 px-2 py-[2px]"
					onClick={onOutputClick}
					size="sm"
					variant="ghost"
				>
					<TableLightningIcon style={{ color: 'var(--du-bois-text-secondary)' }} />
					<Typography>
                        <Text>Output</Text>
                    </Typography>
				</Button>
			</div>
			<div className="h-[24px] w-[1px]" style={{ backgroundColor: 'var(--du-bois-border)' }} />
			<div className="flex gap-2">
				<Button
					className="rounded-sm h-6 px-2 py-[2px]"
					onClick={onSQLClick}
					size="sm"
					variant="ghost"
				>
					<SidebarIcon style={{ color: 'var(--du-bois-text-secondary)' }} />
					<Typography>
                        <Text>SQL</Text>
                    </Typography>
				</Button>
			</div>
		</div>
	);
}