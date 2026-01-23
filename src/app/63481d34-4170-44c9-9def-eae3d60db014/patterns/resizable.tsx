import { useMemo, useState } from "react";

import ReactFlow, { Background, BackgroundVariant, Controls, Edge, Handle, Node, NodeProps, Position } from "reactflow";
import "reactflow/dist/style.css";

import { SidebarCollapseIcon, SidebarExpandIcon } from "@databricks/design-system";

import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Box } from "@/components/mini-patterns/box";

import Panel1 from "./panel1";

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

export function Graph({ 
    onNodeClick, 
    selectedNodeId 
}: { 
    onNodeClick: (nodeId: string | null) => void;
    selectedNodeId: string | null;
}) {
    const initialNodes: Node[] = useMemo(() => [
        { 
            id: "1", 
            data: { label: "Node 1" }, 
            position: { x: 0, y: 0 }, 
            type: "custom",
            selected: selectedNodeId === "1"
        },
        { 
            id: "2", 
            data: { label: "Node 2" }, 
            position: { x: 100, y: 0 }, 
            type: "custom",
            selected: selectedNodeId === "2"
        },
        { 
            id: "3", 
            data: { label: "Node 3" }, 
            position: { x: 200, y: 0 }, 
            type: "custom",
            selected: selectedNodeId === "3"
        },
    ], [selectedNodeId]);
    const initialEdges: Edge[] = useMemo(() => [
        { 
            id: "e1-2",
            source: "1",
            target: "2",
            type: "straight"
        },
        { 
            id: "e2-3",
            source: "2",
            target: "3",
            type: "straight"
        },
    ], []);

    const nodeTypes = useMemo(() => ({
        custom: CustomNode,
    }), []);
    
    return (
        <div aria-label="graph" className="bg-white-800 h-full overflow-hidden">
            <ReactFlow 
                defaultViewport={{ x: 0, y: 0, zoom: 0.25 }}
                edges={initialEdges}
                fitView
                nodeTypes={nodeTypes}
                nodes={initialNodes}
                onNodeClick={(event, node) => {
                    const newSelectedId = selectedNodeId === node.id ? null : node.id;
                    onNodeClick(newSelectedId);
                }}
                onPaneClick={() => {
                    onNodeClick(null);
                }}
            >
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

interface ResizableProps {
    notifications?: NotificationProps[];
    parameters?: ParameterProps[];
}

export default function Resizable({ notifications, parameters }: ResizableProps) {
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
                        <Graph onNodeClick={handleNodeClick} selectedNodeId={selectedNodeId} />
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
                        description="This job processes raw customer activity logs from the previous 24 hours and generates aggregated metrics for dashboard reporting."
                        id="63481d34-4170-44c9-9def-eae3d60db014"
                    />
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
