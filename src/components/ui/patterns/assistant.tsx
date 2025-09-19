"use client"

import { Button } from "@/components/ui/button"

import { CloseIcon, Typography } from "@databricks/design-system"

const { Text } = Typography

export function Assistant({ onClose }: { onClose: () => void }) {    
    return (
        <div aria-label="assistant" className="border-l border-(--du-bois-color-border) flex flex-col h-full min-w-[300px] p-2">
            <div className="items-center flex justify-between w-full">
                <Typography>
                    <Text bold>Assistant</Text>
                </Typography>
                <div className="flex justify-end w-full">
                    <Button
                        aria-label="close-assistant"
                        className="rounded-sm"
                        onClick={onClose}
                        size="icon"
                        variant="ghost"
                    >
                        <CloseIcon />
                    </Button>
                </div>
            </div>
        </div>
    )
}