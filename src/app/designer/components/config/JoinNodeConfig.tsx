"use client"

import React from "react"

import { Button } from "@/components/ui/button"
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
    JoinCondition,
    JoinNodeData,
    JoinOperator,
    JoinType,
    LogicalOperator
} from "@/app/designer/types/nodes"

const { Paragraph, Text } = Typography

interface JoinNodeConfigProps {
    nodeId: string
}

export function JoinNodeConfig({ nodeId }: JoinNodeConfigProps) {
    const {
        nodeData,
        errors,
        isValid,
        addJoinCondition,
        updateJoinCondition,
        removeJoinCondition,
        updateJoinType
    } = useNodeConfiguration(nodeId)

    const joinData = nodeData as JoinNodeData | undefined
    const conditions = joinData?.conditions || []
    const leftColumns = joinData?.columnHeaders || [] // In real app, get from left input
    const rightColumns = joinData?.columnHeaders || [] // In real app, get from right input

    const handleAddCondition = () => {
        const newCondition: JoinCondition = {
            id: `condition-${Date.now()}`,
            leftColumn: "",
            logicalOperator: conditions.length > 0 ? "AND" : undefined,
            operator: "=",
            rightColumn: ""
        }
        addJoinCondition(newCondition)
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div>
                <Typography>
                    <Text className="font-medium text-sm">Join Configuration</Text>
                </Typography>
                <Typography>
                    <Paragraph className="text-gray-600 text-xs">
                        Configure how to join two datasets
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

            {/* Join Type */}
            <div>
                <Typography>
                    <Text className="font-medium mb-1 text-xs">Join Type</Text>
                </Typography>
                <Select
                    value={joinData?.joinType || "inner"}
                    onValueChange={(value) => updateJoinType(value as JoinType)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="inner">Inner Join</SelectItem>
                        <SelectItem value="left">Left Join</SelectItem>
                        <SelectItem value="right">Right Join</SelectItem>
                        <SelectItem value="full">Full Outer Join</SelectItem>
                        <SelectItem value="cross">Cross Join</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Join Conditions */}
            <div>
                <Typography>
                    <Text className="font-medium mb-2 text-xs">Join Conditions</Text>
                </Typography>

                <div className="flex flex-col gap-2">
                    {conditions.map((condition, index) => (
                        <div key={condition.id} className="flex flex-col gap-2">
                            {/* Logical Operator */}
                            {index > 0 && (
                                <Select
                                    value={condition.logicalOperator || "AND"}
                                    onValueChange={(value) => 
                                        updateJoinCondition(condition.id, { 
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
                                {/* Left Column */}
                                <Select
                                    value={condition.leftColumn}
                                    onValueChange={(value) => 
                                        updateJoinCondition(condition.id, { leftColumn: value })
                                    }
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Left column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {leftColumns.length === 0 ? (
                                            <SelectItem value="_none" disabled>
                                                No columns
                                            </SelectItem>
                                        ) : (
                                            leftColumns.map(col => (
                                                <SelectItem key={col} value={col}>
                                                    {col}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>

                                {/* Operator */}
                                <Select
                                    value={condition.operator}
                                    onValueChange={(value) => 
                                        updateJoinCondition(condition.id, { 
                                            operator: value as JoinOperator 
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-16">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="=">=</SelectItem>
                                        <SelectItem value="!=">!=</SelectItem>
                                        <SelectItem value="<">{"<"}</SelectItem>
                                        <SelectItem value=">">{">"}</SelectItem>
                                        <SelectItem value="<=">{"<="}</SelectItem>
                                        <SelectItem value=">=">{">="}</SelectItem>
                                        <SelectItem value="LIKE">LIKE</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Right Column */}
                                <Select
                                    value={condition.rightColumn}
                                    onValueChange={(value) => 
                                        updateJoinCondition(condition.id, { rightColumn: value })
                                    }
                                >
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Right column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rightColumns.length === 0 ? (
                                            <SelectItem value="_none" disabled>
                                                No columns
                                            </SelectItem>
                                        ) : (
                                            rightColumns.map(col => (
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
                                    onClick={() => removeJoinCondition(condition.id)}
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
                    className="rounded-sm mt-2 w-fit"
                    onClick={handleAddCondition}
                    size="sm"
                    variant="outline"
                >
                    Add condition
                </Button>
            </div>

            {/* Preview Summary */}
            {joinData?.recordCount !== undefined && (
                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                    <span className="font-medium">Preview:</span>
                    <span>
                        {joinData.previewData?.length || 0} of {joinData.recordCount} rows
                    </span>
                </div>
            )}
        </div>
    )
}
