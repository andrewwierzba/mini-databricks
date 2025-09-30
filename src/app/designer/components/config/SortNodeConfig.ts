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
import { SortColumn, SortDirection, SortNodeData } from "@/app/designer/types/nodes"

const { Paragraph, Text } = Typography

interface SortNodeConfigProps {
    nodeId: string
}

export function SortNodeConfig({ nodeId }: SortNodeConfigProps) {
    const {
        nodeData,
        addSortColumn,
        updateSortColumn,
        removeSortColumn
    } = useNodeConfiguration(nodeId)

    const sortData = nodeData as SortNodeData | undefined
    const columns = sortData?.columns || []
    const availableColumns = sortData?.columnHeaders || []

    const handleAddColumn = () => {
        const newColumn: SortColumn = {
            column: "",
            direction: "ASC"
        }
        addSortColumn(newColumn)
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div>
                <Typography>
                    <Text className="font-medium text-sm">Sort Configuration</Text>
                </Typography>
                <Typography>
                    <Paragraph className="text-gray-600 text-xs">
                        Order rows by one or more columns
                    </Paragraph>
                </Typography>
            </div>

            {/* Sort Columns */}
            <div className="flex flex-col gap-2">
                {columns.map((sortCol, index) => (
                    <div key={index} className="items-center flex gap-2">
                        {/* Column Selection */}
                        <Select
                            value={sortCol.column}
                            onValueChange={(value) => 
                                updateSortColumn(index, { column: value })
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

                        {/* Direction Selection */}
                        <Select
                            value={sortCol.direction}
                            onValueChange={(value) => 
                                updateSortColumn(index, { direction: value as SortDirection })
                            }
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ASC">Ascending</SelectItem>
                                <SelectItem value="DESC">Descending</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Remove Button */}
                        <Button
                            className="rounded-sm h-8 w-8"
                            onClick={() => removeSortColumn(index)}
                            size="icon"
                            variant="ghost"
                        >
                            <TrashIcon />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Add Column Button */}
            <Button
                className="rounded-sm w-fit"
                onClick={handleAddColumn}
                size="sm"
                variant="outline"
            >
                Add sort column
            </Button>

            {/* Preview Summary */}
            {sortData?.recordCount !== undefined && (
                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                    <span className="font-medium">Preview:</span>
                    <span>
                        {sortData.previewData?.length || 0} of {sortData.recordCount} rows
                    </span>
                </div>
            )}
        </div>
    )
}
