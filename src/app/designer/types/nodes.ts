import { ComponentType } from "react"
import { z } from "zod"

import {
    CheckIcon,
    FilterIcon,
    JoinOperatorIcon,
    LayerIcon,
    SortUnsortedIcon,
    TableCombineIcon,
    TableIcon, 
    TableLightningIcon,
    PlusIcon
} from "@databricks/design-system"

/* ========================================================================
   Heading: 
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
   Heading: 
   Logical Operators (supported in all nodes) 
======================================================================== */

export type LogicalOperator = "AND" | "OR"

/* ========================================================================
   Heading: 
   Validation (supported in all nodes) 
======================================================================== */

export interface ValidationError {
    field?: string
    message: string
    type: "error" | "warning"
}

export interface ValidationResult {
    errors: ValidationError[]
    isValid: boolean
    warnings: ValidationError[]
}

/* ========================================================================
   Heading: 
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
    columnHeaders?: string[]
    groupBy?: string[]
    name: string
    nodeType: "aggregate"
    previewData?: Array<Record<string, any>>
    recordCount?: number
}

/* ========================================================================
   Heading: 
   Combine Node 
======================================================================== */

export interface CombineNodeData {
    columnHeaders?: string[];
    name: string;
    outputOptions: "all" | "distinct";
    previewData?: any[];
}

/* ========================================================================
   Heading: 
   Filter Node 
======================================================================== */

export interface FilterCondition {
    column: string;
    id: string;
    logicalOperator?: "AND" | "OR";
    operator: string;
    value: any;
}

export interface FilterNodeData {
    columnHeaders?: string[];
    conditions: FilterCondition[];
    name: string;
    previewData?: any[];
}

/* ========================================================================
   Heading: 
   Input Node 
======================================================================== */

export interface InputNodeData {
    columnHeaders?: string[];
    filePath?: string;
    fileSize?: number;
    name: string;
    previewData?: any[];
    recordCount?: number;
    schema?: string;
    tableName?: string;
    uploadedFile?: string;
}

/* ========================================================================
   Heading: 
   Join Node 
======================================================================== */

export interface JoinCondition {
    id: string;
    leftColumn: string;
    logicalOperator?: "AND" | "OR";
    operator: "=" | "!=" | "<" | ">" | "<=" | ">=" | "LIKE";
    rightColumn: string;
}

export interface JoinNodeData {
    columnHeaders?: string[];
    conditions: JoinCondition[];
    joinType: "inner" | "left" | "right" | "full";
    leftTableAlias?: string;
    name: string;
    outputColumns?: {
        leftColumns: string[];
        rightColumns: string[];
    };
    previewData?: any[];
    recordCount?: number;
    rightTableAlias?: string;
}

/* ========================================================================
   Heading: 
   Output Node 
======================================================================== */

export interface OutputNodeData {
    name: string;
    schema?: string;
    tableName?: string;
}

/* ========================================================================
   Heading: 
   Select Node 
======================================================================== */

export interface SelectColumn {
    alias?: string
    name: string
    selected: boolean
    type?: ColumnType
}

export interface SelectNodeData {
    columns: SelectColumn[]
    columnHeaders?: string[]
    name: string
    nodeType: "select"
    previewData?: Array<Record<string, any>>
    recordCount?: number
}

/* ========================================================================
   Heading: 
   Sort Node 
======================================================================== */

export interface SortColumn {
    column: string;
    direction: "ASC" | "DESC";
}

export interface SortNodeData {
    columns: SortColumn[];
    columnHeaders?: string[];
    name: string;
    previewData?: any[];
}

/* ========================================================================
   Heading: 
   Transform Node 
======================================================================== */

export interface TransformExpression {
    alias: string
    expression: string
    id: string
    type?: ColumnType
}

export interface TransformNodeData {
    columnHeaders?: string[]
    expressions: TransformExpression[]
    name: string
    nodeType: "transform"
    previewData?: Array<Record<string, any>>
    recordCount?: number
}

// Node category types 
export interface NodeCategoryConfig {
    icon: ComponentType<any>;
    name: string;
}

// Node data types 
export type NodeData = 
    | FilterNodeData
    | InputNodeData
    | JoinNodeData
    | SortNodeData
    | SelectNodeData;

export interface NodeTypeConfig {
    category: NodeCategoryConfig;
    defaultData?: NodeData;
    description?: string;
    icon: ComponentType<any>;
    id: string;
    label: string;
    sourceNode: boolean;
    targetNode: boolean;
}

export const nodeTypes: NodeTypeConfig[] = [{
        category: {
            icon: TableIcon,
            name: "input"
        },
        defaultData: {
            name: "Input"
        } as InputNodeData,
        icon: TableIcon,
        id: "input",
        label: "Input",
        sourceNode: true,
        targetNode: false
    }, {
        category: {
            icon: PlusIcon,
            name: "transform"
        },
        defaultData: { name: "Aggregate" },
        icon: LayerIcon,
        id: "aggregate",
        label: "Aggregate",
        sourceNode: true,
        targetNode: true
    }, {
        category: {
            icon: PlusIcon,
            name: "transform"
        },
        defaultData: { name: "Combine" },
        icon: TableCombineIcon,
        id: "combine",
        label: "Combine",
        sourceNode: true,
        targetNode: true
    }, {
        category: {
            icon: PlusIcon,
            name: "transform"
        },
        defaultData: {
            name: "Filter"
        } as FilterNodeData,
        icon: FilterIcon,
        id: "filter",
        label: "Filter",
        sourceNode: true,
        targetNode: true
    }, {
        category: {
            icon: PlusIcon,
            name: "transform"
        },
        defaultData: {
            name: "Join"
        } as JoinNodeData,
        icon: JoinOperatorIcon,
        id: "join",
        label: "Join",
        sourceNode: true,
        targetNode: true
    }, {
        category: {
            icon: PlusIcon,
            name: "transform"
        },
        defaultData: {
            name: "Select"
        } as SelectNodeData,
        icon: CheckIcon,
        id: "select",
        label: "Select",
        sourceNode: true,
        targetNode: true
    }, {
        category: {
            icon: PlusIcon,
            name: "transform"
        },
        defaultData: {
            name: "Sort"
        } as SortNodeData,
        icon: SortUnsortedIcon,
        id: "sort",
        label: "Sort",
        sourceNode: true,
        targetNode: true
    }, {
        category: {
            icon: PlusIcon,
            name: "transform"
        },
        defaultData: { name: "Transform" },
        icon: PlusIcon,
        id: "transform",
        label: "Transform",
        sourceNode: true,
        targetNode: true
    }, {
        category: {
            icon: TableLightningIcon,
            name: "output"
        },
        defaultData: { name: "Output" },
        icon: TableLightningIcon,
        id: "output",
        label: "Output",
        sourceNode: false,
        targetNode: true
    }];

export const getNodeTypesByCategory = (categoryName: string): NodeTypeConfig[] => {
    return nodeTypes.filter(nodeType => nodeType.category.name === categoryName);
};

export const getNodeTypeById = (id: string): NodeTypeConfig | undefined => {
    return nodeTypes.find(nodeType => nodeType.id === id);
};
