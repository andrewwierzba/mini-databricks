import { useEffect, useMemo, useState } from "react";

import ReactFlow, { Background, BackgroundVariant, Controls, Edge, Handle, Node, NodeProps, Position, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";

import { SidebarCollapseIcon, SidebarExpandIcon, WorkflowsIcon } from "@databricks/design-system";

import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Box } from "@/components/mini-patterns/box";

import Panel1 from "@/components/mini-patterns/panels/schedule";

function CustomNode({ data, id, selected }: NodeProps<{ label: string }>) {
    return (
        <div 
            className={`bg-white border ${selected ? 'border-sky-600' : 'border-gray-200'} rounded px-3 py-2`}
        >
            {id !== "1" && <Handle position={Position.Left} type="target" />}
            <div className="text-xs">{data.label}</div>
            <Handle position={Position.Right} type="source" />
        </div>
    );
}

function GraphInner({ 
    nodes,
    onNodeClick, 
    selectedNodeId 
}: { 
    nodes: Node[];
    onNodeClick: (nodeId: string | null) => void;
    selectedNodeId: string | null;
}) {
    const { setNodes } = useReactFlow();
    
    // Update node selection state based on selectedNodeId
    const nodesWithSelection = useMemo(() => {
        return nodes.map(node => ({
            ...node,
            selected: selectedNodeId === node.id
        }));
    }, [nodes, selectedNodeId]);

    // Update ReactFlow nodes when nodes prop changes
    useEffect(() => {
        setNodes(nodesWithSelection);
    }, [nodesWithSelection, setNodes]);

    return null;
}

export function Graph({ 
    nodes,
    onNodeClick, 
    selectedNodeId 
}: { 
    nodes: Node[];
    onNodeClick: (nodeId: string | null) => void;
    selectedNodeId: string | null;
}) {
    // Update node selection state based on selectedNodeId
    const nodesWithSelection = useMemo(() => {
        return nodes.map(node => ({
            ...node,
            selected: selectedNodeId === node.id
        }));
    }, [nodes, selectedNodeId]);

    const nodeTypes = useMemo(() => ({
        custom: CustomNode,
    }), []);
    
    return (
        <div aria-label="graph" className="bg-white-800 h-full overflow-hidden">
            <ReactFlow 
                defaultViewport={{ x: 0, y: 0, zoom: 0.25 }}
                fitView
                nodeTypes={nodeTypes}
                nodes={nodesWithSelection}
                onNodeClick={(event, node) => {
                    const newSelectedId = selectedNodeId === node.id ? null : node.id;
                    onNodeClick(newSelectedId);
                }}
                onPaneClick={() => {
                    onNodeClick(null);
                }}
            >
                {nodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-sm p-4">
                        <div className="flex flex-col gap-2 max-w-[200px]">
                            <div className="bg-white border border-neutral-200 rounded-sm flex items-center gap-2 px-3 py-1.5">
                                <div className="bg-neutral-100 rounded-sm h-6 w-6 flex items-center justify-center">
                                    <WorkflowsIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </div>
                                <span>Task type 1</span>
                            </div>
                            <div className="bg-white border border-neutral-200 rounded-sm flex items-center gap-2 px-3 py-1.5">
                                <div className="bg-neutral-100 rounded-sm h-6 w-6 flex items-center justify-center">
                                    <WorkflowsIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </div>
                                <span>Task type 2</span>
                            </div>
                            <div className="bg-white border border-neutral-200 rounded-sm flex items-center gap-2 px-3 py-1.5">
                                <div className="bg-neutral-100 rounded-sm h-6 w-6 flex items-center justify-center">
                                    <WorkflowsIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </div>
                                <span>Task type 3</span>
                            </div>
                            <Button variant="secondary">Browse all task types</Button>
                        </div>
                    </div>
                )}
                <GraphInner nodes={nodes} onNodeClick={onNodeClick} selectedNodeId={selectedNodeId} />
                <Background color="#e5e7eb" gap={12} size={1} variant={BackgroundVariant.Dots} />
                <Controls showFitView={true} showInteractive={false} showZoom={true} />
            </ReactFlow>
        </div>
    );
}

export function Panel2({ isVisible }: { isVisible: boolean }) {
    return (
        <div aria-label="panel-2" className="bg-white h-full overflow-hidden p-4">
            {isVisible ? (
                <Box className="bg-gray-50 border-gray-200 rounded-sm border-dashed flex h-full items-center justify-center w-full">
                    <span className="text-center">Panel 2 / Visible</span>
                </Box>
            ) : (
                <Box className="bg-gray-50 border-gray-200 rounded-sm border-dashed flex h-full items-center justify-center w-full">
                    <span className="text-center">Panel 2 / Hidden</span>
                </Box>
            )}
        </div>
    );
}

interface NotificationProps {
    failure?: boolean;
    id: string;
    start?: boolean;
    success?: boolean;
    type: "email" | "slack" | "webhook";
    value?: string;
}

interface ParameterProps {
    id: string;
    value: string;
}

interface TriggerProps {
    conditions?: Array<{ type: string }>;
    cronExpression?: string;
    hour?: number;
    id: string;
    interval?: number;
    minute?: number;
    scheduleMode?: "simple" | "advanced";
    status?: boolean;
    timeUnit?: string;
    timezone?: string;
    type: string;
    useCronExpression?: boolean;
}

interface ResizableProps {
    notifications?: NotificationProps[];
    parameters?: ParameterProps[];
    nodes?: Node[];
    onNodesChange?: (nodes: Node[]) => void;
    triggers?: TriggerProps[];
}

export default function Resizable({ 
    notifications, 
    parameters,
    nodes = [],
    onNodesChange,
    triggers = []
}: ResizableProps) {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [showPanel1, setShowPanel1] = useState<boolean>(true);
    const [showPanel2, setShowPanel2] = useState<boolean>(false);

    const handleNodeClick = (nodeId: string | null) => {
        setSelectedNodeId(nodeId);
        setShowPanel2(nodeId !== null);
    };

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="border border-gray-200 rounded-lg w-full"
        >
            <ResizablePanel defaultSize={50}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50}>
                        <Graph 
                            nodes={nodes}
                            onNodeClick={handleNodeClick} 
                            selectedNodeId={selectedNodeId} 
                        />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={50}>
                        <Panel2 isVisible={showPanel2} />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className={`relative ${!showPanel1 && 'max-w-12'}`} defaultSize={50}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className="absolute right-2 top-2" onClick={() => setShowPanel1(!showPanel1)} size="icon-sm" variant="ghost">
                            {showPanel1 ? <SidebarCollapseIcon className="scale-x-[-1]" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> : <SidebarExpandIcon className="scale-x-[-1]" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>{showPanel1 ? 'Close sidebar' : 'Open sidebar'}</span>
                    </TooltipContent>
                </Tooltip>
                {showPanel1 && (
                    <Panel1 
                        author="andrew.wierzba@databricks.com"
                        id="63481d34-4170-44c9-9def-eae3d60db014"
                        triggers={triggers}
                    />
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
