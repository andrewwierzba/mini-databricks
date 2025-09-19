"use client"

import { Workspace } from "@/components/ui/patterns/workspace-browser"
import { ReactFlow, Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'

export default function Designer() {
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
        <div className="bg-(--du-bois-color-background-primary) border-(--du-bois-color-border) border rounded-sm flex font-sans h-full overflow-hidden">
            <Workspace />
            <div className="flex-1 h-full">
                <ReactFlow
                    className="bg-(--du-bois-color-background-primary)"
                    edges={initialEdges}
                    fitView
                    nodes={initialNodes}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
}
