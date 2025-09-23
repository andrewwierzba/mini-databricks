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

import { getNodeTypesByCategory } from "@/app/designer/config/nodeTypes"
import { useDesigner } from "@/app/designer/contexts/DesignerContext"

interface ToolbarProps {
	className?: string
}

const { Text } = Typography

export function Toolbar({ className }: ToolbarProps) {
	const { addNode } = useDesigner()
	const transformNodeTypes = getNodeTypesByCategory("transform")

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
					onClick={() => addNode("input")}
					size="sm"
					variant="ghost"
				>
					<TableIcon style={{ color: 'var(--du-bois-text-secondary)' }} />
					<Typography>
                        <Text>Input</Text>
                    </Typography>
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger className="rounded-sm h-6 px-2 py-[2px] inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground">
						<PlusIcon style={{ color: 'var(--du-bois-text-secondary)' }} />
						<Typography>
							<Text>Transform</Text>
						</Typography>
					</DropdownMenuTrigger>
					<DropdownMenuContent
                        align="start"
                        className="rounded-sm"
                        sideOffset={8}
                    >
						{transformNodeTypes.map((nodeType) => {
							return (
								<DropdownMenuItem
									key={nodeType.id}
									onClick={() => addNode(nodeType.id)}
								>
                                    <nodeType.icon className="h-4 w-4" />
									<Typography>
                                        <Text>
                                            {nodeType.label}
                                        </Text>
                                    </Typography>
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>
				<Button
					className="rounded-sm h-6 px-2 py-[2px]"
					onClick={() => addNode("output")}
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
					onClick={() => console.log("SQL: To be completed.")}
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