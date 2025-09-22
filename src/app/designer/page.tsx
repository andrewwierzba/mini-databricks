"use client"

import { useState } from "react"
import { Navigation } from "@/components/ui/patterns/navigation"
import { Workspace } from "@/components/ui/patterns/workspace-browser"
import { Assistant } from "@/components/ui/patterns/assistant"

import { ReactFlow, Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

export default function Designer() {
    const [showAssistant, setShowAssistant] = useState(true)

    const initialNodes = [
        {
            id: '1',
            type: 'default',
            position: { x: 100, y: 100 },
            data: { label: 'Node 1' },
        },
        {
            id: '2',
            type: 'default',
            position: { x: 300, y: 200 },
            data: { label: 'Node 2' },
        },
    ]

    const initialEdges = [
        {
            id: 'e1-2',
            source: '1',
            target: '2',
        },
    ]

    return (
        <div className="flex flex-col h-full">
            <Navigation onOpenAssistant={() => setShowAssistant(true)} />
            <div className="bg-(--du-bois-color-background-primary) border-(--du-bois-color-border) border rounded-sm flex font-sans h-full overflow-hidden">
                <Workspace />
                <div className="flex-1 h-full">
                    <ReactFlow
                        className="bg-(--du-bois-color-background-primary)"
                        edges={initialEdges}
                        fitView
                        nodes={initialNodes}
                        panOnDrag={false}
                        panOnScroll={true}
                        selectionOnDrag={true}
                    >
                        <Background gap={8} />
                        <Controls position="bottom-right" />
                        <MiniMap
                            bgColor="var(--du-bois-background-primary)"
                            maskColor={undefined}
                            maskStrokeColor="var(--du-bois-border)"
                            maskStrokeWidth={1}
                            nodeBorderRadius={20}
                            nodeColor="var(--du-bois-background-primary)"
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
                </div>
                {showAssistant && <Assistant onClose={() => setShowAssistant(false)} />}
            </div>
        </div>
    );
}
