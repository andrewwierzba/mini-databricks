"use client"

import { createContext, useContext, useState } from "react"

import { cn } from "@/lib/utils"

interface PanelContextValue {
    setShowPanel: (show: boolean) => void
    showPanel: boolean
}

const PanelContext = createContext<PanelContextValue | undefined>(undefined)

function usePanelContext() {
    const context = useContext(PanelContext)
    if (!context) {
        throw new Error("Panel components must be used within a Panel")
    }
    return context
}

interface PanelProps {
    children?: React.ReactNode
    collapsible?: boolean
    defaultSize?: number
    maxSize?: number
    minSize?: number
    onClose?: () => void
    side?: "bottom" | "left" | "right"
}

interface PanelContentProps {
    children: React.ReactNode
    className?: string
}

interface PanelTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
    asChild?: boolean
}

function PanelContent({ children, className, ...props }: PanelContentProps) {
    return (
        <div
            className={cn(
                "flex flex-col h-full overflow-auto w-full",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

function PanelTrigger({ onClick, ...props }: PanelTriggerProps) {
    const { setShowPanel } = usePanelContext()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            onClick(e)
        } else {
            e.stopPropagation()
            setShowPanel(false)
        }
    }

    return <button data-slot="panel-trigger" onClick={handleClick} {...props} />
}

function Panel({
    children,
    collapsible = true,
    defaultSize,
    maxSize,
    minSize,
    onClose,
    side = "right"
}: PanelProps) {
    {/* Panel direction */}
    const isHorizontal = side === "left" || side === "right"

    const border = {
        bottom: "border-t",
        left: "border-r",
        right: "border-l"
    }[side]
    const flexDirection = isHorizontal ? "flex-row" : "flex-col"

    {/* Panel visibility */}
    const [showPanel, setShowPanel] = useState(true)

    if (!showPanel) return null

    {/* Panel handle classes */}
    const handleClass = {
        bottom: "cursor-ns-resize h-1 top-0 w-full",
        left: "cursor-ew-resize h-full right-0 w-1",
        right: "cursor-ew-resize h-full left-0 w-1"
    }[side]

    return (
        <PanelContext.Provider value={{ setShowPanel, showPanel }}>
            <div
                aria-label="panel"
                className={`${border} border-(--du-bois-color-border) flex ${flexDirection} relative`}
            >
                <div
                    aria-label="handle"
                    className={`hover:bg-blue-600/20 ${handleClass} absolute transition-colors`}
                />

                {children}
            </div>
        </PanelContext.Provider>
    )
}

export { Panel, PanelContent, PanelTrigger }
