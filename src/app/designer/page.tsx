"use client"

import React, { useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"

import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Background, Connection, Controls, Edge, EdgeChange, MiniMap, Node as FlowNode, NodeChange, NodeMouseHandler, ReactFlowProvider } from "reactflow"
import "reactflow/dist/style.css"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Navigation } from "@/components/ui/patterns/navigation"
import { Workspace } from "@/components/ui/patterns/workspace-browser"
import { Assistant } from "@/components/ui/patterns/assistant"

import { ConfigPanel } from "@/app/designer/components/ConfigPanel"
import Node from "@/app/designer/components/node"
import { Toolbar } from "@/app/designer/components/toolbar"

import { DesignerProvider, useDesigner, ResearchVariant } from "@/app/designer/contexts/DesignerContext"

function DesignerCanvas() {
    const { edges, nodes, researchVariant, selectedNodeId, selectNode, setEdges, setNodes } = useDesigner()

    const [showAssistant, setShowAssistant] = useState(false)
    const [showNodeConfig, setShowNodeConfig] = useState(false)

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

    return (
        <div className="flex flex-col h-full">

            {/* Navigation */ }
            <Navigation onOpenAssistant={() => setShowAssistant(true)} />
            <div className="bg-(--du-bois-color-background-primary) border-(--du-bois-color-border) border rounded-sm flex font-sans h-full overflow-hidden">
                
                {/* Workspace Panel */ }
                <Workspace />

                {/* Main */ }
                <div className="flex flex-col flex-1">
                    <div aria-label="designer-canvas" className="flex flex-col flex-1 relative">

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
                        <Toolbar className="h-fit left-0 absolute top-0 w-fit" />

                        {/* Configuration Panel */ }
                        {showNodeConfig && selectedNodeId && (
                            <ConfigPanel onClose={() => setShowNodeConfig(false)} />
                        )}
                    </div>

                    {/* Preview Panel */}
                    <div className="bg-white border-t flex flex-col w-full" style={{ height: 320 }}>
                        <div className="border-b flex gap-2 justify-between px-3 py-1">
                            <div className="text-xs">Preview</div>
                            <div className="text-gray-600 text-xs">
                                Select a node to preview data
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <Table className="text-sm max-h-50">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-medium min-w-32 truncate">column_name_001</TableHead>
                                        <TableHead className="font-medium min-w-32 truncate">column_name_002</TableHead>
                                        <TableHead className="font-medium min-w-32 truncate">column_name_003</TableHead>
                                        <TableHead className="font-medium min-w-32 truncate">column_name_004</TableHead>
                                        <TableHead className="font-medium min-w-32 truncate">column_name_005</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="min-w-32 truncate">
                                            value_001
                                        </TableCell>
                                        <TableCell className="min-w-32 truncate">
                                            value_002
                                        </TableCell>
                                        <TableCell className="min-w-32 truncate">
                                            value_003
                                        </TableCell>
                                        <TableCell className="min-w-32 truncate">
                                            value_004
                                        </TableCell>
                                        <TableCell className="min-w-32 truncate">
                                            value_005
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* Assistant Panel */ }
                {showAssistant && <Assistant onClose={() => setShowAssistant(false)} />}
            </div>
        </div>
    );
}

export default function Designer() {
    const searchParams = useSearchParams()
    const variant = (searchParams.get('variant') as ResearchVariant) || 'separate'

    return (
        <DesignerProvider initialVariant={variant}>
            <ReactFlowProvider>
                <DesignerCanvas />
            </ReactFlowProvider>
        </DesignerProvider>
    );
}
