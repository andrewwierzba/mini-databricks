"use client"

import React from "react"

import { Button } from "@/components/ui/button"

import { CloseIcon, Typography } from "@databricks/design-system"

import { getNodeTypeById } from "@/app/designer/types/nodes"
import { useDesigner } from "@/app/designer/contexts/DesignerContext"

import {
	AggregateNodeConfig,
	CombineNodeConfig,
	FilterNodeConfig,
	InputNodeConfig,
	JoinNodeConfig,
	OutputNodeConfig,
	SelectNodeConfig,
	SortNodeConfig,
	TransformNodeConfig
} from "@/app/designer/components/config"

const { Title } = Typography

interface ConfigPanelProps {
	onClose: () => void
}

export function ConfigPanel({ onClose }: ConfigPanelProps) {
	const { getNode, selectedNodeId } = useDesigner()

	if (!selectedNodeId) return null

	const node = getNode(selectedNodeId)
	if (!node) return null

	const nodeConfig = getNodeTypeById(node.data?.nodeType)
	const Icon = nodeConfig?.icon

	const renderConfigComponent = () => {
		switch (node.data?.nodeType) {
			case "aggregate":
				return <AggregateNodeConfig nodeId={selectedNodeId} />
			case "combine":
				return <CombineNodeConfig nodeId={selectedNodeId} />
			case "filter":
				return <FilterNodeConfig nodeId={selectedNodeId} />
			case "input":
				return <InputNodeConfig nodeId={selectedNodeId} />
			case "join":
				return <JoinNodeConfig nodeId={selectedNodeId} />
			case "output":
				return <OutputNodeConfig nodeId={selectedNodeId} />
			case "select":
				return <SelectNodeConfig nodeId={selectedNodeId} />
			case "sort":
				return <SortNodeConfig nodeId={selectedNodeId} />
			case "transform":
				return <TransformNodeConfig nodeId={selectedNodeId} />
			default:
				return (
					<Typography>
						<div className="text-sm">Node configuration not available</div>
					</Typography>
				)
		}
	}

	return (
		<div className="bottom-0 max-h-full p-4 absolute right-0 top-0 w-[352px]">
			<div className="bg-white rounded-sm border shadow-xs h-fit max-h-full overflow-auto">
				
				{/* Header */}
				<div className="bg-inherit items-center border-b flex gap-2 justify-between left-0 p-2 sticky right-0 top-0 z-1">
					<div className="items-center flex gap-2">
						{Icon && (
							<Icon
								className="bg-(--du-bois-color-background-secondary) rounded-sm p-1"
								style={{ color: "var(--du-bois-text-secondary)" }}
							/>
						)}
						<Typography>
							<Title level={4}>
								{node.data?.name || "Node"}
							</Title>
						</Typography>
					</div>
					<Button
						aria-label="close-node"
						className="rounded-[4px] h-6 w-6"
						onClick={onClose}
						size="icon"
						variant="ghost"
					>
						<CloseIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
					</Button>
				</div>

				{/* Configuration Content */}
				<div className="p-2">
					{renderConfigComponent()}
				</div>
			</div>
		</div>
	)
}