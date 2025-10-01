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
import {
    FilterCondition,
    FilterNodeData,
    FilterOperator,
    LogicalOperator
} from "@/app/designer/types/nodes"

const { Paragraph, Text } = Typography

interface FilterNodeConfigProps {
    nodeId: string
}

const requiresValue = (operator: FilterOperator): boolean => {
    return operator !== "IS NULL" && operator !== "IS NOT NULL"
}

export function FilterNodeConfig({ nodeId }: FilterNodeConfigProps) {
    const {
        nodeData,
        errors,
        isValid,
        addFilterCondition,
        updateFilterCondition,
        removeFilterCondition
    } = useNodeConfiguration(nodeId)

    const filterData = nodeData as FilterNodeData | undefined
    const conditions = filterData?.conditions || []
    const availableColumns = filterData?.columnHeaders || []

    const handleAddCondition = () => {
        const newCondition: FilterCondition = {
            column: "",
            id: `condition-${Date.now()}`,
            logicalOperator: conditions.length > 0 ? "AND" : undefined,
            operator: "=",
            value: ""
        }
        addFilterCondition(newCondition)
    }

    const handleOperatorChange = (conditionId: string, operator: FilterOperator) => {
        updateFilterCondition(conditionId, { operator })
        
        if (!requiresValue(operator)) {
            updateFilterCondition(conditionId, { value: undefined })
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div>
                <Typography>
                    <Text className="font-medium text-sm">Filter Conditions</Text>
                </Typography>
                <Typography>
                    <Paragraph className="text-gray-600 text-xs">
                        Add conditions to filter your data
                    </Paragraph>
                </Typography>
            </div>

            {/* Validation Errors */}
            {!isValid && errors.length > 0 && (
                <div className="bg-red-50 rounded-sm border-red-200 border text-red-700 text-xs p-2">
                    {errors.map((error, idx) => (
                        <div key={idx}>{error.message}</div>
                    ))}
                </div>
            )}

            {/* Conditions List */}
            <div className="flex flex-col gap-2">
                {conditions.map((condition, index) => (
                    <div key={condition.id} className="flex flex-col gap-2">
                        {/* Logical Operator (AND/OR) */}
                        {index > 0 && (
                            <Select
                                value={condition.logicalOperator || "AND"}
                                onValueChange={(value) => 
                                    updateFilterCondition(condition.id, { 
                                        logicalOperator: value as LogicalOperator 
                                    })
                                }
                            >
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AND">AND</SelectItem>
                                    <SelectItem value="OR">OR</SelectItem>
                                </SelectContent>
                            </Select>
                        )}

                        {/* Condition Row */}
                        <div className="items-center flex gap-2">
                            {/* Column Selection */}
                            <Select
                                value={condition.column}
                                onValueChange={(value) => 
                                    updateFilterCondition(condition.id, { column: value })
                                }
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableColumns.length === 0 ? (
                                        <SelectItem value="_none" disabled>
                                            No columns available
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

                            {/* Operator Selection */}
                            <Select
                                value={condition.operator}
                                onValueChange={(value) => 
                                    handleOperatorChange(condition.id, value as FilterOperator)
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="=">=</SelectItem>
                                    <SelectItem value="!=">!=</SelectItem>
                                    <SelectItem value=">">{">"}</SelectItem>
                                    <SelectItem value=">=">{">="}</SelectItem>
                                    <SelectItem value="<">{"<"}</SelectItem>
                                    <SelectItem value="<=">{"<="}</SelectItem>
                                    <SelectItem value="LIKE">LIKE</SelectItem>
                                    <SelectItem value="NOT LIKE">NOT LIKE</SelectItem>
                                    <SelectItem value="IN">IN</SelectItem>
                                    <SelectItem value="NOT IN">NOT IN</SelectItem>
                                    <SelectItem value="IS NULL">IS NULL</SelectItem>
                                    <SelectItem value="IS NOT NULL">IS NOT NULL</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Value Input */}
                            {requiresValue(condition.operator) && (
                                <Input
                                    className="flex-1"
                                    placeholder="Enter value"
                                    value={condition.value?.toString() || ""}
                                    onChange={(e) => 
                                        updateFilterCondition(condition.id, { 
                                            value: e.target.value 
                                        })
                                    }
                                />
                            )}

                            {/* Remove Button */}
                            <Button
                                className="rounded-sm h-8 w-8"
                                onClick={() => removeFilterCondition(condition.id)}
                                size="icon"
                                variant="ghost"
                            >
                                <TrashIcon />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Condition Button */}
            <Button
                className="rounded-sm w-fit"
                onClick={handleAddCondition}
                size="sm"
                variant="outline"
            >
                Add condition
            </Button>

            {/* Preview Summary */}
            {filterData?.recordCount !== undefined && (
                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                    <span className="font-medium">Preview:</span>
                    <span>
                        {filterData.previewData?.length || 0} of {filterData.recordCount} rows
                    </span>
                </div>
            )}
        </div>
    )
}
