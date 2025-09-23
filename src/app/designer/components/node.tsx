"use client"

import React, { memo } from "react"
import { Handle, NodeProps, Position } from "reactflow"

import { Typography } from "@databricks/design-system"
import { getNodeTypeById } from "@/app/designer/config/nodeTypes"

interface CustomNodeData {
    label: string;
    nodeType: string;
}

const { Hint, Paragraph } = Typography

const CustomNode = ({ data, selected }: NodeProps<CustomNodeData>) => {
    const nodeTypeConfig = getNodeTypeById(data.nodeType);

    const Icon = nodeTypeConfig?.icon;
    const isJoin = data.nodeType === "join";
    
    return (
        <>
            <Typography>
                <Hint className="mb-1">
                    {nodeTypeConfig?.label}
                </Hint>
            </Typography>
            <div 
                className="rounded-md border shadow-xs px-2 py-2 min-w-[128px] relative"
                style={{
                    backgroundColor: "var(--du-bois-color-background-primary)",
                    borderColor: selected ? "var(--du-bois-blue-600)" : "var(--du-bois-border)",
                    color: "var(--du-bois-text-primary)"
                }}
            >
                {nodeTypeConfig?.targetNode && !isJoin && (
                    <Handle
                        type="target"
                        position={Position.Left}
                        style={{
                            backgroundColor: "var(--du-bois-border)",
                            width: "8",
                            height: "8",
                            left: "-4"
                        }}
                    />
                )}
                {isJoin && (
                    <>
                        <Handle
                            id="target-1"
                            position={Position.Left}
                            style={{
                                backgroundColor: "var(--du-bois-border)",
                                width: "8",
                                height: "8",
                                left: "-4",
                                top: "25%"
                            }}
                            type="target"
                        />
                        <Handle
                            id="target-2"
                            position={Position.Left}
                            style={{
                                backgroundColor: "var(--du-bois-border)",
                                width: "8",
                                height: "8",
                                left: "-4",
                                top: "75%"
                            }}
                            type="target"
                        />
                    </>
                )}
                <div className="flex items-center gap-2">
                    {Icon &&
                        <Icon
                            className="bg-(--du-bois-color-background-secondary) rounded-sm p-1"
                            style={{
                                color: "var(--du-bois-color-text-secondary)"
                            }}
                        />}
                    <Typography>
                        <Paragraph>
                            {nodeTypeConfig?.defaultData?.name}
                        </Paragraph>
                    </Typography>
                </div>
                {nodeTypeConfig?.sourceNode && (
                    <Handle
                        position={Position.Right}
                        style={{
                            backgroundColor: "var(--du-bois-border)",
                            width: "8",
                            height: "8",
                            right: "-4"
                        }}
                        type="source"
                    />
                )}
            </div>
        </>
    )
}

export default memo(CustomNode)