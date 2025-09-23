"use client"

import { createContext, ReactNode, useContext, useCallback, useState } from "react"
import { Node, Edge } from "reactflow"

import { getNodeTypeById, NodeTypeConfig, nodeTypes } from "@/app/designer/config/nodeTypes"

export interface DesignerContextType {
    addNode: (
        nodeTypeId: string,
        position?: { x: number; y: number }
    ) => void;
    availableNodeTypes: NodeTypeConfig[];
    edges: Edge[];
    getNodeTypeConfig: (nodeTypeId: string) => NodeTypeConfig | undefined;
    nodes: Node[];
    selectedNodeId: string | null;
    selectNode: (nodeId: string | null) => void;
    setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
    setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
}

const DesignerContext = createContext<DesignerContextType | null>(null);

export const useDesigner = () => {
    const context = useContext(DesignerContext)

    if (!context) {
        throw new Error('useDesigner must be used within a DesignerProvider');
    }

    return context;
};

interface DesignerProviderProps {
    children: ReactNode;
}

export const DesignerProvider = ({ children }: DesignerProviderProps) => {
    const [edges, setEdges] = useState<Edge[]>([]);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [nodeTypeCounters, setNodeTypeCounters] = useState<Record<string, number>>({});

    const addNode = useCallback((nodeTypeId: string, position?: { x: number; y: number }) => {
        const defaultPosition = position || {
            x: 100,
            y: 100 + (nodes.length * 42) * 2
        }

        const nodeTypeConfig = getNodeTypeById(nodeTypeId)

        if (!nodeTypeConfig) {
            console.error(`Node type '${nodeTypeId}' not found`)
            return
        }

        // Get current counter for this node type and increment it
        const currentCounter = (nodeTypeCounters[nodeTypeId] || 0) + 1;
        setNodeTypeCounters(prev => ({
            ...prev,
            [nodeTypeId]: currentCounter
        }));
        
        const newNodeId = `${nodeTypeId}-${currentCounter}`
        
        const newNode: Node = {
            data: { 
                label: nodeTypeConfig.label,
                nodeType: nodeTypeId
            },
            id: newNodeId,
            position: defaultPosition,
            type: "custom"
        }

        setNodes(prev => [...prev, newNode])

        if (selectedNodeId) {
            const newEdge: Edge = {
                id: `${selectedNodeId}-${newNodeId}`,
                source: selectedNodeId,
                target: newNodeId,
                type: "default",
            }

            setEdges(prev => [...prev, newEdge])
        }

        setSelectedNodeId(newNodeId)
    }, [selectedNodeId, nodeTypeCounters])

    const selectNode = useCallback((nodeId: string | null) => {
        setSelectedNodeId(nodeId);
    }, [])

    const getNodeTypeConfig = useCallback((nodeTypeId: string) => {
        return getNodeTypeById(nodeTypeId);
    }, [])

    const contextValue: DesignerContextType = {
        availableNodeTypes: nodeTypes,
        nodes,
        edges,
        selectedNodeId,
        addNode,
        selectNode,
        setNodes,
        setEdges,
        getNodeTypeConfig,
    }

    return (
        <DesignerContext.Provider value={contextValue}>
            {children}
        </DesignerContext.Provider>
    )
}