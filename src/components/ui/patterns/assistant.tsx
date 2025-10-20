"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { AtIcon, CloseIcon, GearIcon, OverflowIcon, PlusIcon, SendIcon, Typography } from "@databricks/design-system"
import { Avatar } from "@databricks/design-system"

const { Hint, Paragraph, Text, Title } = Typography

interface Message {
    content: string
    id: string
    timestamp: Date
    type: "assistant" | "user"
}

export function Assistant({ onClose }: { onClose: () => void }) {
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState<Message[]>([])

    const handleSend = () => {
        if (!inputValue.trim()) return

        const newMessage: Message = {
            content: inputValue,
            id: Date.now().toString(),
            timestamp: new Date(),
            type: "user"
        }

        setMessages(prev => [...prev, newMessage])
        setInputValue("")
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }
    
    return (
        <div aria-label="assistant" className="border-l border-(--du-bois-color-border) flex flex-col h-full p-2 w-100">
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
            <div className="flex-1 overflow-y-auto py-4">
                {messages.length === 0 ? (
                    <div className="items-center flex text-(--du-bois-text-secondary) justify-center h-full">
                        <Typography>
                            <Paragraph style={{ color: "var(--du-bois-text-secondary)" }}>Ask questions about your code</Paragraph>
                        </Typography>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div className="flex flex-col gap-2" key={message.id}>
                                <div className="flex gap-2">
                                    <Avatar
                                        aria-label="profile"
                                        label="Andrew"
                                        size="sm"
                                        type="user"
                                    />
                                    <Typography>
                                        <Title style={{ color: "var(--du-bois-text-secondary)" }}>first.lastname@databricks.com</Title>
                                    </Typography>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Typography>
                                        <Paragraph className="text-sm whitespace-pre-wrap break-words">
                                            {message.content}
                                        </Paragraph>
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2 mb-2 mt-4 relative w-full">
                <Textarea
                    className="resize-none min-h-[100px]"
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="@ for objects, / for commands, ↑↓ for history"
                    value={inputValue}
                />
                <div className="bottom-2 flex gap-1 left-2 absolute">
                    <Tooltip>
                        <TooltipTrigger>
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
                    <Select defaultValue="chat">
                        <SelectTrigger className="rounded-sm shadow-none text-[13px] h-6 px-2" style={{ height: "24px" }}>
                            <SelectValue placeholder="Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Switch modes</SelectLabel>
                                <SelectItem className="text-[13px]" value="agent">
                                    Agent
                                </SelectItem>
                                <SelectItem className="text-[13px]" value="chat">
                                    Chat
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="bottom-2 flex gap-1 absolute right-2">
                    <Button
                        aria-label="send-assistant"
                        className="rounded-sm"
                        onClick={handleSend}
                        size="icon"
                        variant="ghost"
                    >
                        <SendIcon />
                    </Button>
                </div>
            </div>
            <Typography>
                <Hint className="text-center w-full">
                    Always review the accuracy of responses.
                </Hint>
            </Typography>
        </div>
    )
}