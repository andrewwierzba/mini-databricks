"use client";

import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { AtIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, CloseIcon, GearIcon, OverflowIcon, PlusIcon, SendIcon } from "@databricks/design-system";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GradientSparkle } from "./navigation";

interface PreviewCard {
    content?: React.ReactNode
    diff?: {
        added?: number
        removed?: number
    }
    disabled?: boolean
    header: {
        title?: string | React.ReactNode
    }
    isExpanded?: boolean
    status?: "completed" | "pending"
    verification?: {
        actions?: Array<{
            id?: string
            label: string | React.ReactNode
            onClick: () => void
            variant?: "default" | "outline"
        }>
        required: boolean
    }
}

export function AssistantPreviewCard({ content, diff, disabled, header, isExpanded = true, status, verification }: PreviewCard) {
    const [expanded, setExpanded] = useState(isExpanded)

    useEffect(() => {
        if (disabled) {
            setExpanded(false)
        }
    }, [disabled])

    const handleToggle = () => {
        setExpanded(!expanded)
    }

    return (
        <Card 
            className={cn(
                "border border-neutral-100 rounded-md shadow-xs text-sm gap-0 py-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:opacity-0 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-opacity [&::-webkit-scrollbar-track]:bg-transparent [scrollbar-color:rgb(209_213_219)_transparent] [scrollbar-width:thin] hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:opacity-100",
                disabled && "bg-neutral-50"
            )}
        >
            <CardHeader className="items-center flex justify-between px-3 py-1.5">
                <div className="items-center flex gap-2">
                    <Button onClick={handleToggle} size="icon-sm" variant="ghost">
                        {expanded ? (
                            <ChevronUpIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        ) : (
                            <ChevronDownIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        )}
                    </Button>
                    <span className="text-neutral-500">{header.title}</span>

                    {/* Diff */}
                    {diff && (
                        <div className="items-center flex gap-1">
                            {diff?.added !== undefined && 
                                <span className="text-green-600">+{diff?.added.toString()}</span>
                            }
                            {diff?.removed !== undefined && 
                                <span className="text-red-600">-{diff?.removed.toString()}</span>
                            }
                        </div>
                    )}
                </div>

                {/* Status */}
                {status === "completed" && (
                    <CheckIcon className="size-4 text-green-500" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                )}
                {status === "pending" && (
                    <Spinner className="size-4 text-neutral-500" />
                )}
            </CardHeader>
            {expanded && content && (
                <CardContent className="border-t border-neutral-100 max-h-32 overflow-x-auto px-0">
                    {content}
                </CardContent>
            )}
            {verification && (
                <CardFooter className="items-center border-t-[1px] border-neutral-100 flex gap-2 justify-between px-3 py-1.5">
                    <span>Ask every time</span>
                    <div className="flex gap-1.5">
                        {verification.actions?.map((action) => (
                            <Button
                                key={action.id}
                                onClick={action.onClick}
                                size="sm"
                                variant={action.variant ?? "default"}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}

interface Action {
    label: string
    onClick: () => void
}

interface Responses {
    actions?: Action[]
    content: string | React.ReactNode
    delay?: number
    previewCard?: PreviewCard
}

interface AssistantProps {
    defaultWidth?: string
    minWidth?: string
    onApplyChanges?: () => void
    onClose: () => void
    previewCardExpanded?: boolean
    responses?: Responses[]
}

interface Message {
    actions?: Action[]
    content: string | React.ReactNode
    id: string
    isThinking?: boolean
    previewCard?: PreviewCard
    timestamp: Date
    type: "assistant" | "user"
    actionsDismissed?: boolean
    rejected?: boolean
}

export function Assistant({ defaultWidth = "384px", minWidth = "256px", onApplyChanges, onClose, previewCardExpanded = true, responses = [] }: AssistantProps) {
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const hasAppliedChangesRef = useRef(false)
    const timeoutRefsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

    useEffect(() => {
        const assistantMessages = messages.filter(m => m.type === "assistant" && !m.isThinking)
        const userMessages = messages.filter(m => m.type === "user")
        
        if (assistantMessages.length === 2 && userMessages.length === 2 && onApplyChanges && !hasAppliedChangesRef.current) {
            hasAppliedChangesRef.current = true
            onApplyChanges()
        }
    }, [messages, onApplyChanges])

    useEffect(() => {
        return () => {
            timeoutRefsRef.current.forEach(timeout => clearTimeout(timeout))
            timeoutRefsRef.current.clear()
        }
    }, [])

    const handleSend = () => {
        if (!inputValue.trim()) return

        const userMessage: Message = {
            content: inputValue,
            id: Date.now().toString(),
            timestamp: new Date(),
            type: "user"
        }

        setMessages(prev => {
            const newMessages = [...prev, userMessage]
            const userMessageCount = prev.filter(m => m.type === "user").length
            
            if (userMessageCount < responses.length) {
                const response = responses[userMessageCount]
                const messageId = (Date.now() + 1).toString()
                
                if (response.delay && response.delay > 0) {
                    const thinkingMessage: Message = {
                        content: "Thinking...",
                        id: messageId,
                        isThinking: true,
                        timestamp: new Date(),
                        type: "assistant"
                    }
                    
                    const timeoutId = setTimeout(() => {
                        setMessages(current => {
                            return current.map(msg => 
                                msg.id === messageId 
                                    ? {
                                        actions: response.actions,
                                        content: response.content,
                                        id: messageId,
                                        previewCard: response.previewCard,
                                        timestamp: new Date(),
                                        type: "assistant"
                                    }
                                    : msg
                            )
                        })
                        timeoutRefsRef.current.delete(messageId)
                    }, response.delay)
                    
                    timeoutRefsRef.current.set(messageId, timeoutId)
                    return [...newMessages, thinkingMessage]
                } else {
                    const aiMessage: Message = {
                        actions: response.actions,
                        content: response.content,
                        id: messageId,
                        previewCard: response.previewCard,
                        timestamp: new Date(),
                        type: "assistant"
                    }
                    return [...newMessages, aiMessage]
                }
            }
            
            return newMessages
        })
        setInputValue("")
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }
    
    return (
        <div
            aria-label="assistant"
            className="flex flex-col h-full p-2"
            style={{
                minWidth: minWidth,
                width: defaultWidth
            }}
        >
            <div className="items-center flex justify-between w-full">
                <span className="text-sm font-semibold relative -top-[2px]">Assistant</span>
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
                                <PlusIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span style={{ color: 'var(--du-bois-text-white)' }}>
                                New thread
                            </span>
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
                                <GearIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span style={{ color: 'var(--du-bois-text-white)' }}>
                                Settings
                            </span>
                        </TooltipContent>
                    </Tooltip>
                    <Button
                        aria-label="more-assistant"
                        className="rounded-sm h-6 w-6"
                        size="icon"
                        variant="ghost"
                    >
                        <OverflowIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
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
                                <CloseIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span style={{ color: 'var(--du-bois-text-white)' }}>
                                Close
                            </span>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:opacity-0 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-opacity [&::-webkit-scrollbar-track]:bg-transparent [scrollbar-color:rgb(209_213_219)_transparent] [scrollbar-width:thin] hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:opacity-100">
                {messages.length === 0 ? (
                    <div className="items-center flex flex-col gap-3 justify-center h-full">
                        <GradientSparkle isFilled={true} size={24} />
                        <div className="items-center flex flex-col gap-1">
                            <span className="text-md font-semibold">Databricks Assistant</span>
                            <span className="text-neutral-500 text-sm">Ask questions about your code</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div className="flex flex-col gap-2" key={message.id}>
                                {message.type === "user" && (
                                    <>
                                        {/* <div className="flex gap-2">
                                            <Avatar
                                                aria-label="profile"
                                                label="Andrew"
                                                size="sm"
                                                type="user"
                                            />
                                            <span style={{ color: "var(--du-bois-text-secondary)", fontSize: "14px", fontWeight: "600" }}>
                                                first.lastname@databricks.com
                                            </span>
                                        </div> */}
                                        <div className="bg-neutral-100 rounded-sm px-3 py-2 w-fit ml-auto">
                                            <span className="text-sm leading-normal">
                                                {message.content}
                                            </span>
                                        </div>
                                    </>
                                )}

                                {message.type === "assistant" && (
                                    <>
                                        {/* <div className="flex gap-2">
                                            <Avatar
                                                aria-label="profile"
                                                label="AI"
                                                size="sm"
                                                type="user"
                                            />
                                            <span style={{ color: "var(--du-bois-text-secondary)", fontSize: "14px", fontWeight: "600" }}>
                                                Assistant
                                            </span>
                                        </div> */}
                                        <div className="flex flex-col gap-4">
                                            {message.isThinking ? (
                                                <span className="text-gray-500 text-sm">
                                                    Thinking
                                                    <span className="inline-flex gap-0.5 ml-1">
                                                        <span className="animate-[thinking_1.4s_ease-in-out_infinite] opacity-0">.</span>
                                                        <span className="animate-[thinking_1.4s_ease-in-out_0.2s_infinite] opacity-0">.</span>
                                                        <span className="animate-[thinking_1.4s_ease-in-out_0.4s_infinite] opacity-0">.</span>
                                                    </span>
                                                </span>
                                            ) : (
                                                <span className="text-sm leading-normal">
                                                    {message.content}
                                                </span>
                                            )}

                                            {!message.isThinking && message.previewCard && (
                                                <>
                                                    <AssistantPreviewCard
                                                        content={message.previewCard.content}
                                                        diff={message.previewCard.diff}
                                                        disabled={message.rejected}
                                                        header={message.previewCard.header}
                                                        isExpanded={previewCardExpanded ?? true}
                                                        status={message.previewCard.status}
                                                        verification={message.previewCard.verification}
                                                    />

                                                    {message.actions && message.actions.length > 0 && !message.actionsDismissed && (
                                                        <div className="flex gap-2">
                                                            {message.actions.map((action, index) => (
                                                                <Button
                                                                    key={index}
                                                                    className={`rounded-sm h-6 px-2 py-1 ${index === 0 ? '' : 'border-neutral-200'}`}
                                                                    onClick={() => {
                                                                        action.onClick();
                                                                        setMessages(prev => prev.map(msg => 
                                                                            msg.id === message.id 
                                                                                ? { ...msg, actionsDismissed: true, rejected: action.label === "Reject" }
                                                                                : msg
                                                                        ));
                                                                    }}
                                                                    size="sm"
                                                                    variant={index === 0 ? "default" : "outline"}
                                                                >
                                                                    {action.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
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
                                <AtIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span style={{ color: 'var(--du-bois-text-white)' }}>
                                Reference assets
                            </span>
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
                        <SendIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </Button>
                </div>
            </div>
            <span className="text-gray-500 text-[12px] text-center w-full">
                Always review the accuracy of responses.
            </span>
        </div>
    )
}