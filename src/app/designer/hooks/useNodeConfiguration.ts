// src/app/designer/hooks/useNodeConfiguration.ts

import { useCallback, useMemo } from "react"
import { useDesigner } from "@/app/designer/contexts/DesignerContext"
import {
    Aggregation,
    AggregateNodeData,
    CombineNodeData,
    FilterCondition,
    FilterNodeData,
    InputNodeData,
    JoinCondition,
    JoinNodeData,
    NodeData,
    OutputNodeData,
    SelectColumn,
    SelectNodeData,
    SortColumn,
    SortNodeData,
    TransformExpression,
    TransformNodeData
} from "@/app/designer/types/nodes"

/* ========================================================================
   Heading: 
   Manage Node Configuration State 
======================================================================== */

export function useNodeConfiguration(nodeId: string | null) {
    const { getNode, getNodeValidationErrors, updateNodeData, validateNode } = useDesigner()
    
    const node = useMemo(() => {
        return nodeId ? getNode(nodeId) : undefined
    }, [nodeId, getNode])

    const validation = useMemo(() => {
        return nodeId ? validateNode(nodeId) : null
    }, [nodeId, validateNode])

    const errors = useMemo(() => {
        return nodeId ? getNodeValidationErrors(nodeId) : []
    }, [nodeId, getNodeValidationErrors])

    // Update function
    const updateConfig = useCallback(<T extends NodeData>(updates: Partial<T>) => {
        if (!nodeId) return
        updateNodeData(nodeId, updates)
    }, [nodeId, updateNodeData])

    /* ========================================================================
       Heading: 
       Aggregate Node Helpers 
    ======================================================================== */

    const addAggregation = useCallback((aggregation: Aggregation) => {
        if (!node || node.data.nodeType !== "aggregate") return
        
        const data = node.data as AggregateNodeData
        const aggregations = [...(data.aggregations || []), aggregation]
        
        updateConfig<AggregateNodeData>({ aggregations })
    }, [node, updateConfig])

    const removeAggregation = useCallback((aggregationId: string) => {
        if (!node || node.data.nodeType !== "aggregate") return
        
        const data = node.data as AggregateNodeData
        const aggregations = data.aggregations.filter(a => a.id !== aggregationId)
        
        updateConfig<AggregateNodeData>({ aggregations })
    }, [node, updateConfig])

    const updateAggregation = useCallback((aggregationId: string, updates: Partial<Aggregation>) => {
        if (!node || node.data.nodeType !== "aggregate") return
        
        const data = node.data as AggregateNodeData
        const aggregations = data.aggregations.map(a => 
            a.id === aggregationId ? { ...a, ...updates } : a
        )
        
        updateConfig<AggregateNodeData>({ aggregations })
    }, [node, updateConfig])

    const updateGroupBy = useCallback((groupBy: string[]) => {
        if (!node || node.data.nodeType !== "aggregate") return
        updateConfig<AggregateNodeData>({ groupBy })
    }, [node, updateConfig])

    /* ========================================================================
       Heading: 
       Combine Node Helpers 
    ======================================================================== */

    const updateCombineConfig = useCallback((deduplicateRows: boolean) => {
        if (!node || node.data.nodeType !== "combine") return
        updateConfig<CombineNodeData>({ deduplicateRows })
    }, [node, updateConfig])

    /* ========================================================================
       Heading: 
       Filter Node Helpers 
    ======================================================================== */

    const addFilterCondition = useCallback((condition: FilterCondition) => {
        if (!node || node.data.nodeType !== "filter") return
        
        const data = node.data as FilterNodeData
        const conditions = [...(data.conditions || []), condition]
        
        updateConfig<FilterNodeData>({ conditions })
    }, [node, updateConfig])

    const removeFilterCondition = useCallback((conditionId: string) => {
        if (!node || node.data.nodeType !== "filter") return
        
        const data = node.data as FilterNodeData
        const conditions = data.conditions.filter(c => c.id !== conditionId)
        
        updateConfig<FilterNodeData>({ conditions })
    }, [node, updateConfig])

    const updateFilterCondition = useCallback((conditionId: string, updates: Partial<FilterCondition>) => {
        if (!node || node.data.nodeType !== "filter") return
        
        const data = node.data as FilterNodeData
        const conditions = data.conditions.map(c => 
            c.id === conditionId ? { ...c, ...updates } : c
        )
        
        updateConfig<FilterNodeData>({ conditions })
    }, [node, updateConfig])

    /* ========================================================================
       Heading: 
       Input Node Helpers 
    ======================================================================== */

    const clearInputFile = useCallback(() => {
        if (!node || node.data.nodeType !== "input") return
        
        updateConfig<InputNodeData>({
            fileName: undefined,
            fileSize: undefined,
            fileType: undefined,
            uploadedFile: undefined,
            filePath: undefined
        })
    }, [node, updateConfig])
    
    const updateInputFile = useCallback((file: File) => {
        if (!node || node.data.nodeType !== "input") return
        
        updateConfig<InputNodeData>({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.name.endsWith('.csv') ? 'csv' : 
                     file.name.endsWith('.json') ? 'json' : 'parquet',
            uploadedFile: file.name
        })
    }, [node, updateConfig])

    /* ========================================================================
       Heading: 
       Join Node Helpers 
    ======================================================================== */

    const addJoinCondition = useCallback((condition: JoinCondition) => {
        if (!node || node.data.nodeType !== "join") return
        
        const data = node.data as JoinNodeData
        const conditions = [...(data.conditions || []), condition]
        
        updateConfig<JoinNodeData>({ conditions })
    }, [node, updateConfig])

    const removeJoinCondition = useCallback((conditionId: string) => {
        if (!node || node.data.nodeType !== "join") return
        
        const data = node.data as JoinNodeData
        const conditions = data.conditions.filter(c => c.id !== conditionId)
        
        updateConfig<JoinNodeData>({ conditions })
    }, [node, updateConfig])

    const updateJoinCondition = useCallback((conditionId: string, updates: Partial<JoinCondition>) => {
        if (!node || node.data.nodeType !== "join") return
        
        const data = node.data as JoinNodeData
        const conditions = data.conditions.map(c => 
            c.id === conditionId ? { ...c, ...updates } : c
        )
        
        updateConfig<JoinNodeData>({ conditions })
    }, [node, updateConfig])

    const updateJoinType = useCallback((joinType: JoinNodeData["joinType"]) => {
        if (!node || node.data.nodeType !== "join") return
        updateConfig<JoinNodeData>({ joinType })
    }, [node, updateConfig])

    /* ========================================================================
       Heading: 
       Output Node Helpers 
    ======================================================================== */

    const updateOutputConfig = useCallback((
        config: Partial<Pick<OutputNodeData, "outputFormat" | "writeMode" | "destinationTable" | "destinationPath">>
    ) => {
        if (!node || node.data.nodeType !== "output") return
        updateConfig<OutputNodeData>(config)
    }, [node, updateConfig])

    /* ========================================================================
       Heading: 
       Select Node Helpers 
    ======================================================================== */

    const renameSelectColumn = useCallback((columnName: string, alias: string) => {
        if (!node || node.data.nodeType !== "select") return
        
        const data = node.data as SelectNodeData
        const columns = data.columns.map(c => 
            c.name === columnName ? { ...c, alias } : c
        )
        
        updateConfig<SelectNodeData>({ columns })
    }, [node, updateConfig])
    
    const toggleSelectColumn = useCallback((columnName: string) => {
        if (!node || node.data.nodeType !== "select") return
        
        const data = node.data as SelectNodeData
        const columns = data.columns.map(c => 
            c.name === columnName ? { ...c, selected: !c.selected } : c
        )
        
        updateConfig<SelectNodeData>({ columns })
    }, [node, updateConfig])
    
    const updateSelectColumns = useCallback((columns: SelectColumn[]) => {
        if (!node || node.data.nodeType !== "select") return
        updateConfig<SelectNodeData>({ columns })
    }, [node, updateConfig])

    /* ========================================================================
       Heading: 
       Sort Node Helpers 
    ======================================================================== */

    const addSortColumn = useCallback((column: SortColumn) => {
        if (!node || node.data.nodeType !== "sort") return
        
        const data = node.data as SortNodeData
        const columns = [...(data.columns || []), column]
        
        updateConfig<SortNodeData>({ columns })
    }, [node, updateConfig])

    const removeSortColumn = useCallback((index: number) => {
        if (!node || node.data.nodeType !== "sort") return
        
        const data = node.data as SortNodeData
        const columns = data.columns.filter((_, i) => i !== index)
        
        updateConfig<SortNodeData>({ columns })
    }, [node, updateConfig])

    const updateSortColumn = useCallback((index: number, updates: Partial<SortColumn>) => {
        if (!node || node.data.nodeType !== "sort") return
        
        const data = node.data as SortNodeData
        const columns = data.columns.map((c, i) => 
            i === index ? { ...c, ...updates } : c
        )
        
        updateConfig<SortNodeData>({ columns })
    }, [node, updateConfig])

    /* ========================================================================
       Heading: 
       Transform Node Helpers 
    ======================================================================== */

    const addTransformExpression = useCallback((expression: TransformExpression) => {
        if (!node || node.data.nodeType !== "transform") return
        
        const data = node.data as TransformNodeData
        const expressions = [...(data.expressions || []), expression]
        
        updateConfig<TransformNodeData>({ expressions })
    }, [node, updateConfig])

    const removeTransformExpression = useCallback((expressionId: string) => {
        if (!node || node.data.nodeType !== "transform") return
        
        const data = node.data as TransformNodeData
        const expressions = data.expressions.filter(e => e.id !== expressionId)
        
        updateConfig<TransformNodeData>({ expressions })
    }, [node, updateConfig])

    const updateTransformExpression = useCallback((expressionId: string, updates: Partial<TransformExpression>) => {
        if (!node || node.data.nodeType !== "transform") return
        
        const data = node.data as TransformNodeData
        const expressions = data.expressions.map(e => 
            e.id === expressionId ? { ...e, ...updates } : e
        )
        
        updateConfig<TransformNodeData>({ expressions })
    }, [node, updateConfig])

    /* ========================================================================
       Heading: 
       Return Object with All Helpers 
    ======================================================================== */

    return {
        // Node data
        node,
        nodeData: node?.data,
        nodeType: node?.data.nodeType,
        
        // Validation
        errors,
        isValid: validation?.isValid ?? false,
        validation,
        
        // Generic update
        updateConfig,

        // Aggregate helpers
        addAggregation,
        removeAggregation,
        updateAggregation,
        updateGroupBy,

        // Combine helpers
        updateCombineConfig,
        
        // Filter helpers
        addFilterCondition,
        removeFilterCondition,
        updateFilterCondition,

        // Input helpers
        clearInputFile,
        updateInputFile,
        
        // Join helpers
        addJoinCondition,
        removeJoinCondition,
        updateJoinCondition,
        updateJoinType,

        // Output helpers
        updateOutputConfig,
        
        // Select helpers
        renameSelectColumn,
        toggleSelectColumn,
        updateSelectColumns,
        
        // Sort helpers
        addSortColumn,
        removeSortColumn,
        updateSortColumn,
        
        // Transform helpers
        addTransformExpression,
        removeTransformExpression,
        updateTransformExpression
    }
}
