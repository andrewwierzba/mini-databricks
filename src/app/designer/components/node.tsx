"use client"

import React, { memo, useMemo } from "react"
import { Handle, NodeProps, Position } from "reactflow"

import { Typography } from "@databricks/design-system"

import { getNodeTypeById, NodeData } from "@/app/designer/config/nodeTypes"
import { useDesigner } from "@/app/designer/contexts/DesignerContext"

type CustomNodeData = NodeData & {
    isValid?: boolean;
    label: string;
    nodeType: string;
    validationErrors?: string[];
}

const { Hint, Paragraph } = Typography

const getTargetHandleCount = (nodeType: string): number => {
    switch (nodeType) {
        case "combine":
        case "join":
            return 2;
        case "input":
            return 0;
        default:
            return 1;
    }
}

const getTargetHandlePositions = (count: number): number[] => {
    if (count === 0) return [];
    if (count === 1) return [50];
    if (count === 2) return [33, 67];
    
    const step = 100 / (count + 1);
    return Array.from({ length: count }, (_, i) => step * (i + 1));
}

const getNodeStatusColor = (data: CustomNodeData, selected: boolean): string => {
    if (data.isValid === false) return "var(--du-bois-red-600)";
    if (selected) return "var(--du-bois-blue-600)";
    return "var(--du-bois-border)";
}

const useIncomingEdgeCount = (nodeId: string): number => {
    const { edges } = useDesigner();
    return useMemo(() => 
        edges.filter(edge => edge.target === nodeId).length,
        [edges, nodeId]
    );
}

const CustomNode = ({ id, data, selected }: NodeProps<CustomNodeData>) => {
    const nodeTypeConfig = getNodeTypeById(data.nodeType);
    const { selectNode } = useDesigner();
    const incomingEdgeCount = useIncomingEdgeCount(id);
    
    const Icon = nodeTypeConfig?.icon;
    const targetHandleCount = getTargetHandleCount(data.nodeType);
    const targetHandlePositions = getTargetHandlePositions(targetHandleCount);
    const borderColor = getNodeStatusColor(data, selected);
    
    // Validation: check if node has required connections
    const isConnectionValid = useMemo(() => {
        if (targetHandleCount === 0) return true; // Input nodes don't need connections
        if (targetHandleCount === 2 && incomingEdgeCount < 2) return false; // Join/Combine need 2
        if (targetHandleCount === 1 && incomingEdgeCount < 1) return false; // Others need at least 1
        return true;
    }, [targetHandleCount, incomingEdgeCount]);

    const validationMessage = useMemo(() => {
        if (!isConnectionValid) {
            if (targetHandleCount === 2) {
                return `Requires 2 inputs (${incomingEdgeCount}/2 connected)`;
            }
            return "Requires at least 1 input";
        }
        if (data.validationErrors && data.validationErrors.length > 0) {
            return data.validationErrors.join(", ");
        }
        return null;
    }, [isConnectionValid, data.validationErrors, targetHandleCount, incomingEdgeCount]);

    const handleClick = (e: React.MouseEvent) => {
        // e.stopPropagation();
        selectNode(id);
    };
    
    return (
        <>
            {/* Node label */}
            <Typography>
                <Hint className="mb-1" style={{ color: "var(--du-bois-color-text-secondary)" }}>
                    {nodeTypeConfig?.label}
                </Hint>
            </Typography>

            {/* Node */}
            <div 
                className="rounded-md border shadow-xs px-3 py-2 min-w-[160px] relative cursor-pointer transition-all hover:shadow-sm"
                style={{
                    backgroundColor: "var(--du-bois-color-background-primary)",
                    borderColor: borderColor,
                    borderWidth: selected ? "2px" : "1px",
                    color: "var(--du-bois-text-primary)"
                }}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                aria-label={`${nodeTypeConfig?.label} node: ${data.name}`}
                aria-selected={selected}
            >
                    
                {/* Target Handles */}
                {nodeTypeConfig?.targetNode && targetHandlePositions.map((position, index) => (
                    <Handle
                        key={`target-${index}`}
                        id={targetHandleCount > 1 ? `target-${index + 1}` : undefined}
                        type="target"
                        position={Position.Left}
                        style={{
                            backgroundColor: isConnectionValid 
                                ? "var(--du-bois-border)" 
                                : "var(--du-bois-red-500)",
                            width: "10px",
                            height: "10px",
                            left: "-5px",
                            top: `${position}%`,
                            border: "2px solid var(--du-bois-color-background-primary)"
                        }}
                        aria-label={`Target handle ${index + 1}`}
                    />
                ))}

                {/* Node Content */}
                <div className="items-center flex gap-2">
                    {Icon && (
                        <div
                            className="items-center rounded-sm flex h-6 p-1 w-6"
                            style={{
                                backgroundColor: "var(--du-bois-color-background-secondary)",
                                color: "var(--du-bois-color-text-secondary)"
                            }}
                        >
                            <Icon className="h-4 w-4" />
                        </div>
                    )}
                    <div>
                        <Typography>
                            <Paragraph className="font-medium truncate">
                                {data?.name || nodeTypeConfig?.defaultData?.name || "Node"}
                            </Paragraph>
                        </Typography>
                    </div>
                </div>

                {/* Validation Badge */}
                {!isConnectionValid && (
                    <div
                        className="absolute -top-1 -right-1 rounded-full"
                        style={{
                            backgroundColor: "var(--du-bois-red-600)",
                            width: "8px",
                            height: "8px",
                            border: "2px solid var(--du-bois-color-background-primary)"
                        }}
                        aria-label="Validation error"
                    />
                )}

                {/* Source Handle */}
                {nodeTypeConfig?.sourceNode && (
                    <Handle
                        type="source"
                        position={Position.Right}
                        style={{
                            backgroundColor: "var(--du-bois-border)",
                            width: "10px",
                            height: "10px",
                            right: "-5px",
                            border: "2px solid var(--du-bois-color-background-primary)"
                        }}
                        aria-label="Source handle"
                    />
                )}
            </div>
        </>
    )
}

export default memo(CustomNode)