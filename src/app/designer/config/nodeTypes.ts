import { ComponentType } from "react";

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
} from "@databricks/design-system";

// To do: Define
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

export interface SelectNodeData {
    columns: string[];
    name: string;
    previewData?: any[];
}

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

export type NodeData = 
    | FilterNodeData
    | InputNodeData
    | JoinNodeData
    | SortNodeData
    | SelectNodeData;

// To do: Define
export interface NodeCategoryConfig {
    icon: ComponentType<any>;
    name: string;
}

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
