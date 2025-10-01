"use client"

import React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import { Typography } from "@databricks/design-system"

import { useNodeConfiguration } from "@/app/designer/hooks/useNodeConfiguration"
import { CombineNodeData } from "@/app/designer/types/nodes"

const { Paragraph, Text } = Typography

interface CombineNodeConfigProps {
    nodeId: string
}

export function CombineNodeConfig({ nodeId }: CombineNodeConfigProps) {
    const {
        nodeData,
        updateCombineConfig
    } = useNodeConfiguration(nodeId)

    const combineData = nodeData as CombineNodeData | undefined

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div>
                <Typography>
                    <Text className="font-medium text-sm">Combine Configuration</Text>
                </Typography>
                <Typography>
                    <Paragraph className="text-gray-600 text-xs">
                        Union multiple datasets together
                    </Paragraph>
                </Typography>
            </div>

            {/* Deduplicate Option */}
            <div className="items-center flex gap-2">
                <Checkbox 
                    checked={combineData?.deduplicateRows || false}
                    id="deduplicate"
                    onCheckedChange={(checked) => 
                        updateCombineConfig(checked === true)
                    }
                />
                <Label 
                    className="cursor-pointer text-sm"
                    htmlFor="deduplicate"
                >
                    Remove duplicate rows
                </Label>
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-sm border-blue-200 border text-blue-700 text-xs p-2">
                This node combines all rows from connected inputs. Columns must match across all inputs.
            </div>

            {/* Preview Summary */}
            {combineData?.recordCount !== undefined && (
                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                    <span className="font-medium">Preview:</span>
                    <span>
                        {combineData.previewData?.length || 0} of {combineData.recordCount} rows
                    </span>
                </div>
            )}
        </div>
    )
}
