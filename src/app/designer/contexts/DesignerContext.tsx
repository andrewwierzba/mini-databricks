"use client"

import { createContext, ReactNode, useContext, useCallback, useEffect, useState } from "react"
import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, Node, NodeChange } from "reactflow"

import { getNodeTypeById, nodeTypes, NodeTypeConfig } from "@/app/designer/types/nodes"

export type ResearchVariant = "combined" | "separate"

export interface DesignerState {
    nodes: Node[];
    nodeTypeCount: Record<string, number>;
    edges: Edge[];
}

export interface DesignerContextType {
    addNode: (
        nodeTypeId: string,
        position?: { x: number; y: number }
    ) => void;
    availableNodeTypes: NodeTypeConfig[];
    canConnect: (connection: Connection) => boolean;
    clearDesigner: () => void;
    deleteEdge: (edgeId: string) => void;
    deleteNode: (nodeId: string) => void;
    duplicateNode: (nodeId: string) => void;
    edges: Edge[];
    exportDesigner: () => string;
    getNodeTypeConfig: (nodeTypeId: string) => NodeTypeConfig | undefined;
    importDesigner: (data: string) => void;
    nodes: Node[];
    onConnect: (connection: Connection) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    redo: () => void;
    researchVariant: ResearchVariant;
    selectedNodeId: string | null;
    selectNode: (nodeId: string | null) => void;
    setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
    setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
    undo: () => void;
    updateNodeData: (nodeId: string, data: Partial<any>) => void;
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
    initialVariant?: ResearchVariant;
    storageKey?: string;
}

const createDefaultNodes = (): { nodes: Node[], edges: Edge[] } => {
    const inputNodeConfig = getNodeTypeById("input")
    const joinNodeConfig = getNodeTypeById("join")

    if (!inputNodeConfig || !joinNodeConfig) return { nodes: [], edges: [] }

    const nodes: Node[] = [{
            data: { 
                ...inputNodeConfig.defaultData,
                filePath: "/files/customer_cases-500.csv",
                label: inputNodeConfig.label,
                name: "customer_cases",
                nodeType: "input",
                schema: "public",
                tableName: "customer_cases"
            },
            id: "input-1",
            position: { x: 100, y: 100 },
            type: "custom",
        }, {
            data: { 
                ...inputNodeConfig.defaultData,
                filePath: "/files/customers-1000.csv",
                label: inputNodeConfig.label,
                name: "customers",
                nodeType: "input",
                schema: "public",
                tableName: "customers"
            },
            id: "input-2",
            position: { x: 100, y: 200 },
            type: "custom",
        }, {
            data: { 
                ...inputNodeConfig.defaultData,
                filePath: "/files/agents-100.csv",
                label: inputNodeConfig.label,
                name: "agents",
                nodeType: "input",
                schema: "public",
                tableName: "agents"
            },
            id: "input-3",
            position: { x: 100, y: 300 },
            type: "custom",
        }, {
            data: { 
                ...joinNodeConfig.defaultData,
                conditions: [{
                    id: "condition-1",
                    leftColumn: "customer_id",
                    operator: "=" as const,
                    logicalOperator: "AND" as const,
                    rightColumn: "id"
                }],
                joinType: "inner" as const,
                label: joinNodeConfig.label,
                leftTableAlias: "customer_cases",
                name: "join_1",
                nodeType: "join",
                rightTableAlias: "customers"
            },
            id: "join-1",
            position: { x: 360, y: 100 },
            type: "custom",
        }, {
            data: { 
                ...joinNodeConfig.defaultData,
                conditions: [{
                    id: "condition-1",
                    leftColumn: "agent_id",
                    operator: "=" as const,
                    logicalOperator: "AND" as const,
                    rightColumn: "agents_id"
                }],
                joinType: "inner" as const,
                label: joinNodeConfig.label,
                leftTableAlias: "join_1",
                name: "join_2",
                nodeType: "join",
                rightTableAlias: "agents"
            },
            id: "join-2",
            position: { x: 620, y: 200 },
            type: "custom",
        }]

    const edges: Edge[] = [{
            id: "input-1-join-1",
            source: "input-1",
            target: "join-1",
            targetHandle: "target-1",
            type: "default",
        }, {
            id: "input-2-join-1",
            source: "input-2",
            target: "join-1",
            targetHandle: "target-2",
            type: "default",
        }, {
            id: "join-1-join-2",
            source: "join-1",
            target: "join-2",
            targetHandle: "target-1",
            type: "default",
        }, {
            id: "input-3-join-2",
            source: "input-3",
            target: "join-2",
            targetHandle: "target-2",
            type: "default",
        }]

    return { nodes, edges }
}

const HISTORY_LIMIT = 50;

export const DesignerProvider = ({
    children,
    initialVariant = "separate",
    storageKey = "designer-state"
}: DesignerProviderProps) => {
    const [edges, setEdges] = useState<Edge[]>([]);
    const [history, setHistory] = useState<DesignerState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [nodeTypeCount, setNodeTypeCount] = useState<Record<string, number>>({});
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [researchVariant] = useState<ResearchVariant>(initialVariant);

    // Initialize from localStorage or defaults
    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setNodes(parsed.nodes || []);
                setEdges(parsed.edges || []);
                setNodeTypeCount(parsed.nodeTypeCount || {});
            } catch (e) {
                console.error("Failed to parse stored designer state", e);
                const defaults = createDefaultNodes();
                setNodes(defaults.nodes);
                setEdges(defaults.edges);
                setNodeTypeCount({ input: 3, join: 2 });
            }
        } else {
            const defaults = createDefaultNodes();
            setNodes(defaults.nodes);
            setEdges(defaults.edges);
            setNodeTypeCount({ input: 3, join: 2 });
        }
    }, [storageKey]);

    // Save to localStorage on change
    useEffect(() => {
        if (nodes.length > 0 || edges.length > 0) {
            localStorage.setItem(storageKey, JSON.stringify({
                nodes,
                edges,
                nodeTypeCount
            }));
        }
    }, [nodes, edges, nodeTypeCount, storageKey]);

    // Add to history
    const addToHistory = useCallback(() => {
        const newState: DesignerState = { nodes, edges, nodeTypeCount };
        setHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push(newState);
            return newHistory.slice(-HISTORY_LIMIT);
        });
        setHistoryIndex(prev => Math.min(prev + 1, HISTORY_LIMIT - 1));
    }, [nodes, edges, nodeTypeCount, historyIndex]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            setNodes(prevState.nodes);
            setEdges(prevState.edges);
            setNodeTypeCount(prevState.nodeTypeCount);
            setHistoryIndex(prev => prev - 1);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setNodes(nextState.nodes);
            setEdges(nextState.edges);
            setNodeTypeCount(nextState.nodeTypeCount);
            setHistoryIndex(prev => prev + 1);
        }
    }, [history, historyIndex]);

    const addNode = useCallback((nodeTypeId: string, position?: { x: number; y: number }) => {
        const defaultPosition = position || {
            x: 100 + Math.random() * 200,
            y: 100 + Math.random() * 200
        }

        const nodeTypeConfig = getNodeTypeById(nodeTypeId)

        if (!nodeTypeConfig) {
            console.error(`Node type '${nodeTypeId}' not found`)
            return
        }

        const currentNodeCount = (nodeTypeCount[nodeTypeId] || 0) + 1;

        setNodeTypeCount(prev => ({
            ...prev,
            [nodeTypeId]: currentNodeCount
        }));
        
        const newNodeId = `${nodeTypeId}-${currentNodeCount}`
        
        const newNode: Node = {
            data: { 
                ...nodeTypeConfig.defaultData,
                label: nodeTypeConfig.label,
                nodeType: nodeTypeId
            },
            id: newNodeId,
            position: defaultPosition,
            type: "custom",
        }

        setNodes(prev => [...prev, newNode])

        // Auto-connect if a node is selected and connection is valid
        if (selectedNodeId) {
            const sourceNode = nodes.find(n => n.id === selectedNodeId);
            if (sourceNode) {
                const sourceConfig = getNodeTypeById(sourceNode.data.nodeType);
                if (sourceConfig?.sourceNode && nodeTypeConfig.targetNode) {
                    const newEdge: Edge = {
                        id: `${selectedNodeId}-${newNodeId}`,
                        source: selectedNodeId,
                        target: newNodeId,
                        type: "default",
                    }
                    setEdges(prev => [...prev, newEdge])
                }
            }
        }

        setSelectedNodeId(newNodeId)
        addToHistory()
    }, [selectedNodeId, nodeTypeCount, nodes, addToHistory])

    const deleteNode = useCallback((nodeId: string) => {
        setNodes(prev => prev.filter(node => node.id !== nodeId));
        setEdges(prev => prev.filter(edge => 
            edge.source !== nodeId && edge.target !== nodeId
        ));
        if (selectedNodeId === nodeId) {
            setSelectedNodeId(null);
        }
        addToHistory();
    }, [selectedNodeId, addToHistory]);

    const deleteEdge = useCallback((edgeId: string) => {
        setEdges(prev => prev.filter(edge => edge.id !== edgeId));
        addToHistory();
    }, [addToHistory]);

    const duplicateNode = useCallback((nodeId: string) => {
        const nodeToDuplicate = nodes.find(n => n.id === nodeId);
        if (!nodeToDuplicate) return;

        const nodeTypeId = nodeToDuplicate.data.nodeType;
        const currentNodeCount = (nodeTypeCount[nodeTypeId] || 0) + 1;

        setNodeTypeCount(prev => ({
            ...prev,
            [nodeTypeId]: currentNodeCount
        }));

        const newNodeId = `${nodeTypeId}-${currentNodeCount}`;
        const newNode: Node = {
            ...nodeToDuplicate,
            id: newNodeId,
            position: {
                x: nodeToDuplicate.position.x + 50,
                y: nodeToDuplicate.position.y + 50
            },
            data: {
                ...nodeToDuplicate.data,
                name: `${nodeToDuplicate.data.name} (Copy)`
            }
        };

        setNodes(prev => [...prev, newNode]);
        setSelectedNodeId(newNodeId);
        addToHistory();
    }, [nodes, nodeTypeCount, addToHistory]);

    const updateNodeData = useCallback((nodeId: string, data: Partial<any>) => {
        setNodes(prev => prev.map(node => 
            node.id === nodeId 
                ? { ...node, data: { ...node.data, ...data } }
                : node
        ));
        addToHistory();
    }, [addToHistory]);

    const selectNode = useCallback((nodeId: string | null) => {
        setSelectedNodeId(nodeId);
    }, [])

    const getNodeTypeConfig = useCallback((nodeTypeId: string) => {
        return getNodeTypeById(nodeTypeId);
    }, [])

    const canConnect = useCallback((connection: Connection): boolean => {
        if (!connection.source || !connection.target) return false;

        const sourceNode = nodes.find(n => n.id === connection.source);
        const targetNode = nodes.find(n => n.id === connection.target);

        if (!sourceNode || !targetNode) return false;

        const sourceConfig = getNodeTypeById(sourceNode.data.nodeType);
        const targetConfig = getNodeTypeById(targetNode.data.nodeType);

        if (!sourceConfig?.sourceNode || !targetConfig?.targetNode) return false;

        // Prevent self-connections
        if (connection.source === connection.target) return false;

        // Prevent duplicate connections
        const duplicateExists = edges.some(edge => 
            edge.source === connection.source && edge.target === connection.target
        );

        return !duplicateExists;
    }, [nodes, edges]);

    const onConnect = useCallback((connection: Connection) => {
        if (canConnect(connection)) {
            setEdges(prev => addEdge(connection, prev));
            addToHistory();
        }
    }, [canConnect, addToHistory]);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes(prev => applyNodeChanges(changes, prev));
    }, []);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges(prev => applyEdgeChanges(changes, prev));
    }, []);

    const clearDesigner = useCallback(() => {
        setNodes([]);
        setEdges([]);
        setNodeTypeCount({});
        setSelectedNodeId(null);
        addToHistory();
    }, [addToHistory]);

    const exportDesigner = useCallback((): string => {
        return JSON.stringify({
            nodes,
            edges,
            nodeTypeCount,
            version: "1.0"
        }, null, 2);
    }, [nodes, edges, nodeTypeCount]);

    const importDesigner = useCallback((data: string) => {
        try {
            const parsed = JSON.parse(data);
            setNodes(parsed.nodes || []);
            setEdges(parsed.edges || []);
            setNodeTypeCount(parsed.nodeTypeCount || {});
            setSelectedNodeId(null);
            addToHistory();
        } catch (e) {
            console.error("Failed to import designer data", e);
        }
    }, [addToHistory]);

    const contextValue: DesignerContextType = {
        addNode,
        availableNodeTypes: nodeTypes,
        canConnect,
        clearDesigner,
        deleteEdge,
        deleteNode,
        duplicateNode,
        edges,
        exportDesigner,
        getNodeTypeConfig,
        importDesigner,
        nodes,
        onConnect,
        onEdgesChange,
        onNodesChange,
        redo,
        researchVariant,
        selectedNodeId,
        selectNode,
        setEdges,
        setNodes,
        undo,
        updateNodeData,
    }

    return (
        <DesignerContext.Provider value={contextValue}>
            {children}
        </DesignerContext.Provider>
    )
}