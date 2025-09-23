"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { AtIcon, CloseIcon, GearIcon, OverflowIcon, PlusIcon, SendIcon, Typography } from "@databricks/design-system"

const { Hint, Paragraph, Text } = Typography

export function Assistant({ onClose }: { onClose: () => void }) {    
    return (
        <div aria-label="assistant" className="border-l border-(--du-bois-color-border) flex flex-col h-full p-2 w-[320px]">
            <div className="items-center flex justify-between w-full">
                <Typography>
                    <Text bold>Assistant</Text>
                </Typography>
                <div className="flex gap-1 justify-end w-full">
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                aria-label="new-assistant"
                                className="rounded-sm h-6 w-6"
                                disabled
                                size="icon"
                                variant="ghost"
                            >
                                <PlusIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <Typography>
                                <Paragraph style={{ color: 'var(--du-bois-text-white)' }}>
                                    New thread
                                </Paragraph>
                            </Typography>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                aria-label="settings-assistant"
                                className="rounded-sm h-6 w-6"
                                size="icon"
                                variant="ghost"
                            >
                                <GearIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <Typography>
                                <Paragraph style={{ color: 'var(--du-bois-text-white)' }}>
                                    Settings
                                </Paragraph>
                            </Typography>
                        </TooltipContent>
                    </Tooltip>
                    <Button
                        aria-label="more-assistant"
                        className="rounded-sm h-6 w-6"
                        size="icon"
                        variant="ghost"
                    >
                        <OverflowIcon />
                    </Button>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                aria-label="close-assistant"
                                className="rounded-sm h-6 w-6"
                                onClick={onClose}
                                size="icon"
                                variant="ghost"
                            >
                                <CloseIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <Typography>
                                <Paragraph style={{ color: 'var(--du-bois-text-white)' }}>
                                    Close
                                </Paragraph>
                            </Typography>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <div className="h-full"></div>
            <div className="flex-1 flex flex-col gap-2 mb-2 mt-4 relative w-full">
                <Textarea 
                    placeholder="@ for objects, / for commands, ↑↓ for history"
                    className="flex-1 resize-none min-h-[100px]"
                />
                <Tooltip>
                    <TooltipTrigger className="bottom-2 left-2 absolute">
                        <Button
                            aria-label="close-assistant"
                            className="rounded-sm h-6 w-6"
                            size="icon"
                            variant="ghost"
                        >
                            <AtIcon />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <Typography>
                            <Paragraph style={{ color: 'var(--du-bois-text-white)' }}>
                                Reference assets
                            </Paragraph>
                        </Typography>
                    </TooltipContent>
                </Tooltip>
                <Button
                    aria-label="send-assistant"
                    className="rounded-sm bottom-2 absolute right-2"
                    size="icon"
                    variant="ghost"
                >
                    <SendIcon />
                </Button>
            </div>
            <Typography>
                <Hint className="text-center w-full">
                    Always review the accuracy of responses.
                </Hint>
            </Typography>
        </div>
    )
}