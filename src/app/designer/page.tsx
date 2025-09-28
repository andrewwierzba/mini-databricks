"use client"

import React, { useState, useCallback, useMemo } from "react"

import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Background, Connection, Controls, Edge, EdgeChange, MiniMap, Node as FlowNode, NodeChange, NodeMouseHandler, ReactFlowProvider } from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Navigation } from "@/components/ui/patterns/navigation"
import { Workspace } from "@/components/ui/patterns/workspace-browser"
import { Assistant } from "@/components/ui/patterns/assistant"

import Node from "@/app/designer/components/node"
import { Toolbar } from "@/app/designer/components/toolbar"

import { getNodeTypeById } from "@/app/designer/config/nodeTypes"
import { DesignerProvider, useDesigner } from "@/app/designer/contexts/DesignerContext"

import Editor from "@/app/designer/components/ui/patterns/editor/page"

import { ChevronDownIcon, ChevronRightIcon, CloseIcon, FileIcon, TrashIcon, Typography } from "@databricks/design-system"

const { Title } = Typography

function DesignerCanvas() {
    const { edges, nodes, selectedNodeId, selectNode, setEdges, setNodes } = useDesigner()

    console.log("selectedNodeId:", selectedNodeId)

    const [fileUploadProgress, setFileUploadProgress] = useState<Record<string, number>>({})
    const [nodeConfigs, setNodeConfigs] = useState<Record<string, {
            filter: {
                column?: string
                operator?: string
                value?: string
            },
            input: {
                data?: any[]
                fileName?: string
                fileType?: "csv" | "json"
            }
        }>>({})

    console.log("nodeConfigs:", nodeConfigs)

    const [previewPanelHeight, setPreviewPanelHeight] = useState(320)
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
                <div className="flex-1 h-full">
                    <div aria-label="designer-canvas" className="flex flex-col h-full relative">

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
                        {showNodeConfig && selectedNodeId && (() => {
                            const selectedNodeData = nodes.find(node => node.id === selectedNodeId);

                            console.log(selectedNodeId, selectedNodeData);
                            
                            return selectedNodeData ? (
                                <div className="bg-white rounded-sm border shadow-xs mr-4 mt-4 absolute right-0 top-0 w-[320px]">
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
                                    <div className="p-2">
                                        {(() => {
                                            switch (selectedNodeData.data?.nodeType) {
                                                case "aggregate":
                                                    return <div className="text-sm">Aggregate node configuration</div>;
                                                case "combine":
                                                    return <div className="text-sm">Combine node configuration</div>;
                                                case "filter":
                                                    return (
                                                        <div>
                                                            <div className="text-sm font-medium">Filter</div>
                                                            <div className="text-gray-600 text-xs mb-2">Filter fields</div>

                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex gap-2">
                                                                    <Select aria-label="filter-column">
                                                                        <SelectTrigger className="flex-1 min-w-0 overflow-hidden *:data-[slot=select-value]:line-clamp-1 [&>span]:truncate">
                                                                            <SelectValue className="inline" placeholder="Select a column" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="id">id</SelectItem>
                                                                            <SelectItem value="customer_id">customer_id</SelectItem>
                                                                            <SelectItem value="agent_id">agent_id</SelectItem>
                                                                            <SelectItem value="status">status</SelectItem>
                                                                            <SelectItem value="created_at">created_at</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <Select
                                                                        aria-label="filter-operator"
                                                                        defaultValue="="
                                                                    >
                                                                        <SelectTrigger className="min-w-0 [&>span]:truncate">
                                                                            <SelectValue placeholder="Select an operator" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="=">{'='}</SelectItem>
                                                                            <SelectItem value="equals">equals</SelectItem>
                                                                            <SelectItem value="!=">!=</SelectItem>
                                                                            <SelectItem value="does not equal">does not equal</SelectItem>
                                                                            <SelectItem value=">">{'>'}</SelectItem>
                                                                            <SelectItem value=">=">{'>='}</SelectItem>
                                                                            <SelectItem value="<">{'<'}</SelectItem>
                                                                            <SelectItem value="<=">{'<='}</SelectItem>
                                                                            <SelectItem value="is null">is null</SelectItem>
                                                                            <SelectItem value="is not null">is not null</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>

                                                                    {/* If filter operator is not "is null" or "is not null", show filter value input */ }
                                                                    <Input
                                                                        aria-label="filter-value"
                                                                        className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                                                                        placeholder="Enter a value"
                                                                    />
                                                                </div>
                                                                
                                                                {/* If column name, operator, and value returns rows, show filter output preview */}
                                                                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                                                                    <span className="font-medium">Preview:</span>
                                                                    <span>5 out of 10 rows</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                case "input":
                                                    return (
                                                        <div>
                                                            <div className="text-sm font-medium">File upload</div>
                                                            <div className="text-gray-600 text-xs mb-2">Browse files to upload</div>

                                                            <div className="flex flex-col gap-2">
                                                                {/* Hidden file input */}
                                                                <input
                                                                    accept=".csv,.json"
                                                                    className="hidden"
                                                                    id={`file-upload-${selectedNodeId}`}
                                                                    type="file"
                                                                />
                                                                
                                                                {/* Interaction: if a file is uploading or has uploaded, show the file card */}
                                                                <div className="align-start rounded-md border flex gap-2 mb-[2px] p-2">
                                                                    <FileIcon className="pt-[2px]" />

                                                                    <div className="flex flex-col w-full">
                                                                        <div className="items-center flex gap-2 justify-between mb-2 w-full">
                                                                            {/* File name */}
                                                                            <div aira-label="file-name" className="text-sm font-medium">
                                                                                customers-1000.csv
                                                                            </div>

                                                                            {/* Remove file */}
                                                                            <Button 
                                                                                aria-label="file-remove"
                                                                                className="rounded-sm h-6 w-6"
                                                                                onClick={() => console.log("Delete file")}
                                                                                size="sm" 
                                                                                variant="ghost"
                                                                            >
                                                                                <TrashIcon />
                                                                            </Button>
                                                                        </div>

                                                                        {/* File progress */}
                                                                        <div>
                                                                            <Progress
                                                                                className="h-1 mb-1"
                                                                                value={50}
                                                                            />
                                                                            <div className="flex gap-2 justify-between">
                                                                                <span className="text-gray-500 text-xs">1.4 Mb</span>
                                                                                <span className="text-gray-500 text-xs">50%</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* If no file, show upload button */}
                                                                <Button 
                                                                    aria-label="upload-file"
                                                                    className="w-fit"
                                                                    onClick={() => document.getElementById(`file-upload-${selectedNodeId}`)?.click()}
                                                                    size="sm"
                                                                >
                                                                    Upload a file
                                                                </Button>

                                                                {/* If file returns rows, show input output preview */}
                                                                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                                                                    <span className="font-medium">Preview:</span>
                                                                    <span>5 out of 10 rows</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                case "join":
                                                    return <div className="text-sm">Join node configuration</div>;
                                                case "select":
                                                    return (
                                                        <div className="flex flex-col gap-2">
                                                            <div>
                                                                <div className="text-sm font-medium">Select</div>
                                                                <div className="text-gray-600 text-xs">Select fields to include, exclude, or rename</div>
                                                            </div>

                                                            <div className="rounded-sm border overflow-hidden">
                                                                <Table className="text-sm">
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>
                                                                                <Checkbox aria-label="select-all" />
                                                                            </TableHead>
                                                                            <TableHead className="font-medium min-w-32 truncate">Column name</TableHead>
                                                                            <TableHead className="font-medium min-w-32 truncate">Type</TableHead>
                                                                            <TableHead className="font-medium min-w-32 truncate">Rename</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        <TableRow>
                                                                            <TableCell className="text-xs max-w-32 truncate">
                                                                                <Checkbox aria-label="select-single" />
                                                                            </TableCell>
                                                                            <TableCell
                                                                                aria-label="column-name"
                                                                                className="min-w-32 truncate"
                                                                            >
                                                                                column_name_001
                                                                            </TableCell>
                                                                            <TableCell className="min-w-32 truncate">
                                                                                <Select aria-label="column-type">
                                                                                    <SelectTrigger className="min-w-0 w-full *:data-[slot=select-value]:line-clamp-1 [&>span]:truncate">
                                                                                        <SelectValue placeholder="Select a column type" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        <SelectItem value="boolean">boolean</SelectItem>
                                                                                        <SelectItem value="date">date</SelectItem>
                                                                                        <SelectItem value="datetime">datetime</SelectItem>
                                                                                        <SelectItem value="integer">integer</SelectItem>
                                                                                        <SelectItem value="string">string</SelectItem>
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </TableCell>
                                                                            <TableCell className="min-w-32 truncate">
                                                                                <Input aria-label="column-rename" />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </div>

                                                            {/* If select returns rows, show select output preview */}
                                                            <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                                                                <span className="font-medium">Preview:</span>
                                                                <span>5 out of 10 rows</span>
                                                            </div>
                                                        </div>
                                                    );
                                                case "sort":
                                                    return <div className="text-sm">Sort node configuration</div>;
                                                case "transform":
                                                    return (
                                                        <div className="flex flex-col gap-2">
                                                            <div>
                                                                <div className="text-sm font-medium">Transform</div>
                                                                <div className="text-gray-600 text-xs">Transform fields</div>
                                                            </div>

                                                            <Collapsible defaultOpen>
                                                                <CollapsibleTrigger className="items-center flex text-sm gap-1 mb-1 w-full">
                                                                    <ChevronRightIcon />
                                                                    Expression
                                                                </CollapsibleTrigger>
                                                                <CollapsibleContent className="flex flex-col gap-2">
                                                                    <div className="flex gap-2">
                                                                        <Select aria-label="transform-column">
                                                                            <SelectTrigger className="min-w-0 w-full *:data-[slot=select-value]:line-clamp-1 [&>span]:truncate">
                                                                                <SelectValue placeholder="Select a column" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="id">id</SelectItem>
                                                                                <SelectItem value="customer_id">customer_id</SelectItem>
                                                                                <SelectItem value="agent_id">agent_id</SelectItem>
                                                                                <SelectItem value="status">status</SelectItem>
                                                                                <SelectItem value="created_at">created_at</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <Select aria-label="transform-column-type" disabled>
                                                                            <SelectTrigger className="min-w-0 w-full *:data-[slot=select-value]:line-clamp-1 [&>span]:truncate">
                                                                                <SelectValue placeholder="Select a column type" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="boolean">boolean</SelectItem>
                                                                                <SelectItem value="date">date</SelectItem>
                                                                                <SelectItem value="datetime">datetime</SelectItem>
                                                                                <SelectItem value="integer">integer</SelectItem>
                                                                                <SelectItem value="string">string</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>

                                                                    <Editor />
                                                                </CollapsibleContent>
                                                            </Collapsible>

                                                            {/* Allow for additional expressions with formulas */}
                                                            <Button
                                                                aria-label="add-expression"
                                                                className="w-fit"
                                                                size="sm"
                                                            >
                                                                Add expression
                                                            </Button>

                                                            {/* If formula returns rows, show formula output preview */}
                                                            <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                                                                <span className="font-medium">Preview:</span>
                                                                <span>5 out of 10 rows</span>
                                                            </div>
                                                        </div>
                                                    );
                                                default:
                                                    return <div className="text-sm">Node configuration</div>;
                                            }
                                        })()}
                                    </div>
                                </div>
                            ) : null;
                        })()}

                        {/* Preview Panel */}
                        <div className="bg-white border-t flex flex-col w-full" style={{ height: previewPanelHeight }}>
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
