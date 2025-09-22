"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { CloseIcon, GearIcon, OverflowIcon, PlusIcon, SendIcon, Typography } from "@databricks/design-system"

const { Text } = Typography

export function Assistant({ onClose }: { onClose: () => void }) {    
    return (
        <div aria-label="assistant" className="border-l border-(--du-bois-color-border) flex flex-col h-full min-w-[300px] p-2">
            <div className="items-center flex justify-between w-full">
                <Typography>
                    <Text bold>Assistant</Text>
                </Typography>
                <div className="flex gap-1 justify-end w-full">
                    <Button
                        aria-label="new-assistant"
                        className="rounded-sm h-6 w-6"
                        size="icon"
                        variant="ghost"
                    >
                        <PlusIcon />
                    </Button>
                    <Button
                        aria-label="settings-assistant"
                        className="rounded-sm h-6 w-6"
                        size="icon"
                        variant="ghost"
                    >
                        <GearIcon />
                    </Button>
                    <Button
                        aria-label="more-assistant"
                        className="rounded-sm h-6 w-6"
                        size="icon"
                        variant="ghost"
                    >
                        <OverflowIcon />
                    </Button>
                    <Button
                        aria-label="close-assistant"
                        className="rounded-sm h-6 w-6"
                        onClick={onClose}
                        size="icon"
                        variant="ghost"
                    >
                        <CloseIcon />
                    </Button>
                </div>
            </div>
            <div className="h-full"></div>
            <div className="flex-1 flex flex-col gap-2 mt-4 relative">
                <Textarea 
                    placeholder="@ for objects, / for commands, ↑↓ for history"
                    className="flex-1 resize-none min-h-[100px]"
                />
                <Button
                    aria-label="send-assistant"
                    className="rounded-sm bottom-2 absolute right-2"
                    size="icon"
                    variant="ghost"
                >
                    <SendIcon />
                </Button>
            </div>
        </div>
    )
}