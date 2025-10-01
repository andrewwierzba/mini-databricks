"use client"

import React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Typography } from "@databricks/design-system"

import { useNodeConfiguration } from "@/app/designer/hooks/useNodeConfiguration"
import { OutputFormat, OutputNodeData, WriteMode } from "@/app/designer/types/nodes"

const { Paragraph, Text } = Typography

interface OutputNodeConfigProps {
    nodeId: string
}

export function OutputNodeConfig({ nodeId }: OutputNodeConfigProps) {
    const {
        nodeData,
        updateOutputConfig
    } = useNodeConfiguration(nodeId)

    const outputData = nodeData as OutputNodeData | undefined

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div>
                <Typography>
                    <Text className="font-medium text-sm">Output Configuration</Text>
                </Typography>
                <Typography>
                    <Paragraph className="text-gray-600 text-xs">
                        Configure where to save the results
                    </Paragraph>
                </Typography>
            </div>

            {/* Output Format */}
            <div>
                <Label className="mb-1 text-xs">Output Format</Label>
                <Select
                    value={outputData?.outputFormat || "table"}
                    onValueChange={(value) => 
                        updateOutputConfig({ outputFormat: value as OutputFormat })
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="table">Table</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                        <SelectItem value="parquet">Parquet File</SelectItem>
                        <SelectItem value="json">JSON File</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Write Mode */}
            <div>
                <Label className="mb-1 text-xs">Write Mode</Label>
                <Select
                    value={outputData?.writeMode || "overwrite"}
                    onValueChange={(value) => 
                        updateOutputConfig({ writeMode: value as WriteMode })
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="overwrite">Overwrite</SelectItem>
                        <SelectItem value="append">Append</SelectItem>
                        <SelectItem value="error">Error if exists</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Destination Path/Table */}
            {outputData?.outputFormat === "table" ? (
                <div>
                    <Label className="mb-1 text-xs">Destination Table</Label>
                    <Input 
                        placeholder="e.g., schema.table_name"
                        value={outputData?.destinationTable || ""}
                        onChange={(e) => 
                            updateOutputConfig({ destinationTable: e.target.value })
                        }
                    />
                </div>
            ) : (
                <div>
                    <Label className="mb-1 text-xs">Destination Path</Label>
                    <Input 
                        placeholder="e.g., /output/data.csv"
                        value={outputData?.destinationPath || ""}
                        onChange={(e) => 
                            updateOutputConfig({ destinationPath: e.target.value })
                        }
                    />
                </div>
            )}

            {/* Preview Summary */}
            {outputData?.recordCount !== undefined && (
                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                    <span className="font-medium">Preview:</span>
                    <span>
                        {outputData.previewData?.length || 0} of {outputData.recordCount} rows
                    </span>
                </div>
            )}
        </div>
    )
}
