import { ComponentType } from "react";

import {
    FilterIcon,
    JoinOperatorIcon,
    LayerIcon,
    SortUnsortedIcon,
    TableCombineIcon,
    TableIcon, 
    TableLightningIcon,
    PlusIcon 
} from "@databricks/design-system";

export interface NodeCategoryConfig {
    icon: ComponentType<any>;
    name: string;
}

export interface NodeTypeConfig {
    category: NodeCategoryConfig;
    defaultData?: Record<string, any>;
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
        defaultData: { name: "Input" },
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
        defaultData: { name: "Filter" },
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
        defaultData: { name: "Join" },
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
        defaultData: { name: "Sort" },
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