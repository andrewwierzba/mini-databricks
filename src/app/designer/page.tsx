"use client"

import React, { useState, useCallback, useMemo } from "react"

import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Background, Connection, Controls, Edge, EdgeChange, MiniMap, Node as FlowNode, NodeChange, NodeMouseHandler, ReactFlowProvider } from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"

import { Navigation } from "@/components/ui/patterns/navigation"
import { Workspace } from "@/components/ui/patterns/workspace-browser"
import { Assistant } from "@/components/ui/patterns/assistant"

import Node from "@/app/designer/components/node"
import { Toolbar } from "@/app/designer/components/toolbar"

import { getNodeTypeById } from "@/config/nodeTypes"
import { DesignerProvider, useDesigner } from "@/contexts/DesignerContext"

import { CloseIcon, Typography } from "@databricks/design-system"

const { Title } = Typography

function DesignerCanvas() {
    const { edges, nodes, selectNode, setEdges, setNodes, selectedNodeId } = useDesigner()
    const [showAssistant, setShowAssistant] = useState(false)
    const [showNodeConfig, setShowNodeConfig] = useState(false)

    const nodeTypes = useMemo(() => ({
        custom: Node,
    }), []);

    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => addEdge(params, eds));
    }, [setEdges]);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, [setEdges]);

    const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
        setShowNodeConfig(true);
    }, []);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, [setNodes]);

    const onSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: FlowNode[] }) => {
        if (selectedNodes.length > 0) {
            selectNode(selectedNodes[0].id);
        } else {
            selectNode(null);
        }
    }, [selectNode]);

    const isValidConnection = useCallback((connection: Connection) => {
        const sourceNode = nodes.find(node => node.id === connection.source);
        const targetNode = nodes.find(node => node.id === connection.target);
        
        if (!sourceNode || !targetNode) return false;
        
        const sourceNodeConfig = getNodeTypeById(sourceNode.data?.nodeType);
        const targetNodeConfig = getNodeTypeById(targetNode.data?.nodeType);
        
        if (!sourceNodeConfig?.sourceNode) return false;
        
        if (!targetNodeConfig?.targetNode) return false;
        
        /* if (targetNode.data?.nodeType === "join") {
            const existingConnections = edges.filter(edge => edge.target === connection.target);
            if (existingConnections.length >= 2) return false;
        }
        
        if (sourceNode.data?.nodeType === "join") {
            const existingConnections = edges.filter(edge => edge.source === connection.source);
            if (existingConnections.length >= 1) return false;
        } */
        
        return true;
    }, [edges, nodes]);

    return (
        <div className="flex flex-col h-full">

            {/* Navigation */ }
            <Navigation onOpenAssistant={() => setShowAssistant(true)} />
            <div className="bg-(--du-bois-color-background-primary) border-(--du-bois-color-border) border rounded-sm flex font-sans h-full overflow-hidden">
                
                {/* Workspace Panel */ }
                <Workspace />

                {/* Main */ }
                <div className="flex-1 h-full">
                    <div aria-label="designer-canvas" className="h-full relative">

                        {/* Directed Acyclic Graph (DAG) */ }
                        <ReactFlow
                            edges={edges}
                            isValidConnection={isValidConnection}
                            nodes={nodes}
                            nodeTypes={nodeTypes}
                            onConnect={onConnect}
                            onEdgesChange={onEdgesChange}
                            onNodeClick={onNodeClick}
                            onNodesChange={onNodesChange}
                            onSelectionChange={onSelectionChange}
                            panOnDrag={false}
                            panOnScroll={true}
                            selectionOnDrag={true}
                        >
                            <Background />
                            <Controls position="bottom-right" />
                            <MiniMap
                                maskColor={undefined}
                                maskStrokeColor="var(--du-bois-border)"
                                maskStrokeWidth={1}
                                nodeBorderRadius={20}
                                nodeColor="var(--du-bois-color-background-primary)"
                                nodeStrokeColor="var(--du-bois-border)"
                                nodeStrokeWidth={10}
                                position="bottom-right" 
                                style={{ 
                                    border: "1px solid var(--du-bois-border)",
                                    borderRadius: "4px",
                                    height: 80,
                                    overflow: "hidden",
                                    right: 36,
                                    width: 138
                                }}
                            />
                        </ReactFlow>

                        {/* Toolbar */ }
                        <Toolbar className="left-0 absolute top-0" />

                        {/* Configuration Panel */ }
                        {showNodeConfig && selectedNodeId && (() => {
                            const selectedNodeData = nodes.find(node => node.id === selectedNodeId);
                            
                            return selectedNodeData ? (
                                <div className="bg-white rounded-sm border shadow-xs absolute right-4 top-4 w-[320px]">
                                    <div className="items-center border-b flex gap-2 justify-between p-2">
                                        <div className="items-center flex gap-2">
                                            {(() => {
                                                const nodeConfig = getNodeTypeById(selectedNodeData.data?.nodeType);
                                                const Icon = nodeConfig?.icon;

                                                return Icon ?
                                                    <Icon
                                                        className="bg-(--du-bois-color-background-secondary) rounded-sm p-1"
                                                        style={{ color: "var(--du-bois-text-secondary)"}}
                                                    />
                                                    : null;
                                            })()}
                                            <Typography>
                                                <Title level={4}>
                                                    {selectedNodeData.data?.label || "Node"}
                                                </Title>
                                            </Typography>
                                        </div>
                                        <Button
                                            aria-label="close-node"
                                            className="rounded-sm h-6 w-6"
                                            onClick={() => setShowNodeConfig(false)}
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <CloseIcon />
                                        </Button>
                                    </div>
                                    <div className="p-2"></div>
                                </div>
                            ) : null;
                        })()}
                    </div>
                </div>

                {/* Assistant Panel */ }
                {showAssistant && <Assistant onClose={() => setShowAssistant(false)} />}
            </div>
        </div>
    );
}

export default function Designer() {
    return (
        <DesignerProvider>
            <ReactFlowProvider>
                <DesignerCanvas />
            </ReactFlowProvider>
        </DesignerProvider>
    );
}
