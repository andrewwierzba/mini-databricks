"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import { FileIcon, TrashIcon, Typography } from "@databricks/design-system"

import { useNodeConfiguration } from "@/app/designer/hooks/useNodeConfiguration"
import { InputNodeData } from "@/app/designer/types/nodes"

const { Paragraph, Text } = Typography

interface InputNodeConfigProps {
    nodeId: string
}

export function InputNodeConfig({ nodeId }: InputNodeConfigProps) {
    const {
        nodeData,
        updateInputFile,
        clearInputFile
    } = useNodeConfiguration(nodeId)

    const inputData = nodeData as InputNodeData | undefined
    const fileName = inputData?.uploadedFile || inputData?.fileName || 
                     (inputData?.filePath ? inputData.filePath.split('/').pop() : null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            updateInputFile(file)
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div>
                <Typography>
                    <Text className="font-medium text-sm">File Upload</Text>
                </Typography>
                <Typography>
                    <Paragraph className="text-gray-600 text-xs">
                        Browse files to upload (CSV, JSON, Parquet)
                    </Paragraph>
                </Typography>
            </div>

            {/* Hidden file input */}
            <input
                accept=".csv,.json,.parquet"
                className="hidden"
                id={`file-upload-${nodeId}`}
                type="file"
                onChange={handleFileChange}
            />

            {/* File Card */}
            {fileName && (
                <div className="align-start rounded-md border flex gap-2 p-2">
                    <FileIcon className="pt-[2px]" />

                    <div className="flex flex-col w-full">
                        {/* File name and remove button */}
                        <div className="items-center flex gap-2 justify-between mb-2 w-full">
                            <Typography>
                                <Text className="font-medium text-sm">{fileName}</Text>
                            </Typography>

                            <Button 
                                className="rounded-sm h-6 w-6"
                                onClick={clearInputFile}
                                size="icon"
                                variant="ghost"
                            >
                                <TrashIcon />
                            </Button>
                        </div>

                        {/* File progress */}
                        <div>
                            <Progress
                                className="h-1 mb-1"
                                value={100}
                            />
                            <div className="flex gap-2 justify-between">
                                <Typography>
                                    <Text className="text-gray-500 text-xs">
                                        {inputData?.fileSize 
                                            ? `${(inputData.fileSize / 1024 / 1024).toFixed(1)} MB`
                                            : "Unknown size"
                                        }
                                    </Text>
                                </Typography>
                                <Typography>
                                    <Text className="text-gray-500 text-xs">100%</Text>
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload button (when no file) */}
            {!fileName && (
                <Button 
                    className="rounded-sm w-fit"
                    onClick={() => document.getElementById(`file-upload-${nodeId}`)?.click()}
                    size="sm"
                    variant="outline"
                >
                    Upload a file
                </Button>
            )}

            {/* Preview Summary */}
            {inputData?.recordCount !== undefined && (
                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                    <span className="font-medium">Preview:</span>
                    <span>
                        {inputData.previewData?.length || 0} of {inputData.recordCount} rows
                    </span>
                </div>
            )}
        </div>
    )
}
