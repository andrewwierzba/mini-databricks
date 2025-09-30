"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { TrashIcon, Typography } from "@databricks/design-system"

import { useNodeConfiguration } from "@/app/designer/hooks/useNodeConfiguration"
import { Aggregation, AggregateNodeData, AggregationFunction } from "@/app/designer/types/nodes"

const { Paragraph, Text } = Typography

interface AggregateNodeConfigProps {
    nodeId: string
}

export function AggregateNodeConfig({ nodeId }: AggregateNodeConfigProps) {
    const {
        nodeData,
        addAggregation,
        updateAggregation,
        removeAggregation,
        updateGroupBy
    } = useNodeConfiguration(nodeId)

    const aggregateData = nodeData as AggregateNodeData | undefined
    const aggregations = aggregateData?.aggregations || []
    const groupBy = aggregateData?.groupBy || []
    const availableColumns = aggregateData?.columnHeaders || []

    const handleAddAggregation = () => {
        const newAggregation: Aggregation = {
            id: `agg-${Date.now()}`,
            column: "",
            function: "COUNT",
            alias: ""
        }
        addAggregation(newAggregation)
    }

    const handleGroupByChange = (values: string[]) => {
        updateGroupBy(values)
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div>
                <Typography>
                    <Text className="font-medium text-sm">Aggregate Configuration</Text>
                </Typography>
                <Typography>
                    <Paragraph className="text-gray-600 text-xs">
                        Group and aggregate data
                    </Paragraph>
                </Typography>
            </div>

            {/* Group By */}
            <div>
                <Typography>
                    <Text className="font-medium mb-1 text-xs">Group By (Optional)</Text>
                </Typography>
                <Select
                    value={groupBy[0] || ""}
                    onValueChange={(value) => handleGroupByChange(value ? [value] : [])}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select column to group by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {availableColumns.map(col => (
                            <SelectItem key={col} value={col}>
                                {col}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Aggregations */}
            <div>
                <Typography>
                    <Text className="font-medium mb-2 text-xs">Aggregations</Text>
                </Typography>

                <div className="flex flex-col gap-2">
                    {aggregations.map((agg) => (
                        <div key={agg.id} className="flex flex-col gap-2 p-2 border rounded-sm">
                            {/* Function and Column Row */}
                            <div className="items-center flex gap-2">
                                {/* Function Selection */}
                                <Select
                                    value={agg.function}
                                    onValueChange={(value) => 
                                        updateAggregation(agg.id, { 
                                            function: value as AggregationFunction 
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="COUNT">COUNT</SelectItem>
                                        <SelectItem value="COUNT_DISTINCT">COUNT_DISTINCT</SelectItem>
                                        <SelectItem value="SUM">SUM</SelectItem>
                                        <SelectItem value="AVG">AVG</SelectItem>
                                        <SelectItem value="MIN">MIN</SelectItem>
                                        <SelectItem value="MAX">MAX</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Column Selection */}
                                <Select
                                    value={agg.column}
                                    onValueChange={(value) => 
                                        updateAggregation(agg.id, { column: value })
                                    }
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableColumns.length === 0 ? (
                                            <SelectItem value="_none" disabled>
                                                No columns
                                            </SelectItem>
                                        ) : (
                                            availableColumns.map(col => (
                                                <SelectItem key={col} value={col}>
                                                    {col}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>

                                {/* Remove Button */}
                                <Button
                                    className="rounded-sm h-8 w-8"
                                    onClick={() => removeAggregation(agg.id)}
                                    size="icon"
                                    variant="ghost"
                                >
                                    <TrashIcon />
                                </Button>
                            </div>

                            {/* Alias Row */}
                            <div>
                                <Typography>
                                    <Text className="mb-1 text-xs">Alias (optional)</Text>
                                </Typography>
                                <Input 
                                    placeholder="e.g., total_count"
                                    value={agg.alias || ""}
                                    onChange={(e) => 
                                        updateAggregation(agg.id, { alias: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Aggregation Button */}
                <Button
                    className="rounded-sm mt-2 w-fit"
                    onClick={handleAddAggregation}
                    size="sm"
                    variant="outline"
                >
                    Add aggregation
                </Button>
            </div>

            {/* Preview Summary */}
            {aggregateData?.recordCount !== undefined && (
                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                    <span className="font-medium">Preview:</span>
                    <span>
                        {aggregateData.previewData?.length || 0} of {aggregateData.recordCount} rows
                    </span>
                </div>
            )}
        </div>
    )
}
