import { ComponentType } from "react"

import {
    CheckIcon,
    FilterIcon,
    JoinOperatorIcon,
    LayerIcon,
    PlusIcon,
    SortUnsortedIcon,
    TableCombineIcon,
    TableIcon,
    TableLightningIcon
} from "@databricks/design-system"

/* ========================================================================
   Column and Column Types (supported in all nodes)
======================================================================== */

export type ColumnType =
    | "boolean"
    | "date"
    | "datetime"
    | "float"
    | "integer"
    | "string"

export interface Column {
    description?: string
    name: string
    type: ColumnType
}

/* ========================================================================
   Logical Operators (supported in all nodes)
======================================================================== */

export type LogicalOperator = "AND" | "OR"

/* ========================================================================
   Aggregate Node
======================================================================== */

export type AggregationFunction =
    | "AVG"
    | "COUNT"
    | "COUNT_DISTINCT"
    | "MAX"
    | "MIN"
    | "SUM"

export interface Aggregation {
    alias?: string
    column: string
    function: AggregationFunction
    id: string
}

export interface AggregateNodeData {
    aggregations: Aggregation[]
    availableColumns?: string[]
    groupBy?: string[]
    name: string
    type: "aggregate"
}

/* ========================================================================
   Combine Node
======================================================================== */

export interface CombineNodeData {
    availableColumns?: string[]
    deduplicateRows: boolean
    name: string
    type: "combine"
}

/* ========================================================================
   Filter Node
======================================================================== */

export type FilterOperator =
    | "!="
    | "<"
    | "<="
    | "="
    | ">"
    | ">="
    | "IN"
    | "IS NOT NULL"
    | "IS NULL"
    | "LIKE"
    | "NOT IN"
    | "NOT LIKE"

export interface FilterCondition {
    column: string
    id: string
    logicalOperator?: "AND" | "OR"
    operator: FilterOperator
    value?: string | number | boolean | null
}

export interface FilterNodeData {
    availableColumns?: string[]
    conditions: FilterCondition[]
    name: string
    type: "filter"
}

/* ========================================================================
   Input Node
======================================================================== */

export type FileType = "csv" | "json" | "parquet"

export interface InputNodeData {
    availableColumns?: string[]
    fileName?: string
    filePath?: string
    fileSize?: number
    fileType?: FileType
    name: string
    schema?: string
    tableName?: string
    type: "input"
    uploadedFile?: string
}

/* ========================================================================
   Join Node
======================================================================== */

export type JoinType = "full" | "inner" | "left" | "right"

export type JoinOperator = "!=" | "<" | "<=" | "=" | ">" | ">=" | "LIKE"

export interface JoinCondition {
    id: string
    leftColumn: string
    logicalOperator?: "AND" | "OR"
    operator: JoinOperator
    rightColumn: string
}

export interface JoinNodeData {
    availableColumns?: string[]
    conditions: JoinCondition[]
    joinType: JoinType
    leftTableAlias?: string
    name: string
    outputColumns?: SelectColumn[]
    rightTableAlias?: string
    type: "join"
}

/* ========================================================================
   Output Node
======================================================================== */

export type OutputFormat = "csv" | "json" | "parquet" | "table"

export type WriteMode = "append" | "error" | "overwrite"

export interface OutputNodeData {
    availableColumns?: string[]
    destinationPath?: string
    destinationTable?: string
    name: string
    outputFormat?: OutputFormat
    schema?: string
    tableName?: string
    type: "output"
    writeMode?: WriteMode
}

/* ========================================================================
   Select Node
======================================================================== */

export interface SelectColumn {
    alias?: string
    name: string
    selected: boolean
    type?: ColumnType
}

export interface SelectNodeData {
    availableColumns?: string[]
    columns: SelectColumn[]
    name: string
    type: "select"
}

/* ========================================================================
   Sort Node
======================================================================== */

export type SortDirection = "ASC" | "DESC"

export interface SortColumn {
    column: string
    direction: SortDirection
}

export interface SortNodeData {
    availableColumns?: string[]
    columns: SortColumn[]
    name: string
    type: "sort"
}

/* ========================================================================
   Transform Node
======================================================================== */

export interface TransformExpression {
    alias: string
    expression: string
    id: string
    type?: ColumnType
}

export interface TransformNodeData {
    availableColumns?: string[]
    expressions: TransformExpression[]
    name: string
    type: "transform"
}

export type NodeData =
    | AggregateNodeData
    | CombineNodeData
    | FilterNodeData
    | InputNodeData
    | JoinNodeData
    | OutputNodeData
    | SelectNodeData
    | SortNodeData
    | TransformNodeData

export interface GroupConfig {
    icon: ComponentType<Record<string, unknown>>
    name: string
}

export interface TypeConfig {
    defaultData?: Partial<NodeData>
    description?: string
    group: GroupConfig
    icon: ComponentType<Record<string, unknown>>
    id: string
    label: string
    sourceNode: boolean
    targetNode: boolean
}

export const types: TypeConfig[] = [{
        defaultData: {
            name: "Input"
        } as InputNodeData,
        description: "Connect to a table within a database or upload files into your workflow.",
        group: {
            icon: TableIcon as unknown as ComponentType<Record<string, unknown>>,
            name: "input"
        },
        icon: TableIcon as unknown as ComponentType<Record<string, unknown>>,
        id: "input",
        label: "Input",
        sourceNode: true,
        targetNode: false
    }, {
        defaultData: { name: "Aggregate" },
        group: {
            icon: PlusIcon as unknown as ComponentType<Record<string, unknown>>,
            name: "transform"
        },
        icon: LayerIcon as unknown as ComponentType<Record<string, unknown>>,
        id: "aggregate",
        label: "Aggregate",
        sourceNode: true,
        targetNode: true
    }, {
        defaultData: { name: "Combine" },
        group: {
            icon: PlusIcon as unknown as ComponentType<Record<string, unknown>>,
            name: "transform"
        },
        icon: TableCombineIcon as unknown as ComponentType<Record<string, unknown>>,
        id: "combine",
        label: "Combine",
        sourceNode: true,
        targetNode: true
    }, {
        defaultData: {
            name: "Filter"
        } as FilterNodeData,
        group: {
            icon: PlusIcon as unknown as ComponentType<Record<string, unknown>>,
            name: "transform"
        },
        icon: FilterIcon as unknown as ComponentType<Record<string, unknown>>,
        id: "filter",
        label: "Filter",
        sourceNode: true,
        targetNode: true
    }, {
        defaultData: {
            name: "Join"
        } as JoinNodeData,
        description: "Merge rows from two datasets with matching keys or columns.",
        group: {
            icon: PlusIcon as unknown as ComponentType<Record<string, unknown>>,
            name: "transform"
        },
        icon: JoinOperatorIcon as unknown as ComponentType<Record<string, unknown>>,
        id: "join",
        label: "Join",
        sourceNode: true,
        targetNode: true
    }, {
        defaultData: {
            name: "Select"
        } as SelectNodeData,
        description: "Select fields to include, exclude, or rename.",
        group: {
            icon: PlusIcon as unknown as ComponentType<Record<string, unknown>>,
            name: "transform"
        },
        icon: CheckIcon as unknown as ComponentType<Record<string, unknown>>,
        id: "select",
        label: "Select",
        sourceNode: true,
        targetNode: true
    }, {
        defaultData: {
            name: "Sort"
        } as SortNodeData,
        description: "Sort rows based on the values in columns.",
        group: {
            icon: PlusIcon as unknown as ComponentType<Record<string, unknown>>,
            name: "transform"
        },
        icon: SortUnsortedIcon as unknown as ComponentType<Record<string, unknown>>,
        id: "sort",
        label: "Sort",
        sourceNode: true,
        targetNode: true
    }, {
        defaultData: { name: "Transform" },
        group: {
            icon: PlusIcon as unknown as ComponentType<Record<string, unknown>>,
            name: "transform"
        },
        icon: PlusIcon as unknown as ComponentType<Record<string, unknown>>,
        id: "transform",
        label: "Transform",
        sourceNode: true,
        targetNode: true
    }, {
        defaultData: { name: "Output" },
        group: {
            icon: TableLightningIcon as unknown as ComponentType<Record<string, unknown>>,
            name: "output"
        },
        icon: TableLightningIcon as unknown as ComponentType<Record<string, unknown>>,
        id: "output",
        label: "Output",
        sourceNode: false,
        targetNode: true
    }]

export const getNodeTypeById = (id: string): TypeConfig | undefined => {
    return types.find(type => type.id === id)
}

export const getNodeTypesByGroup = (groupName: string): TypeConfig[] => {
    return types.filter(type => type.group.name === groupName)
}
