"use client"

import { createContext, useContext, useRef, useState } from "react"

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
    allowDragResize?: boolean
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
    allowDragResize = true,
    children,
    defaultSize,
    maxSize,
    minSize,
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

    {/* Panel size */}
    const [size, setSize] = useState<number | undefined>(defaultSize)
    const isDraggingRef = useRef(false)
    const startPosRef = useRef(0)
    const startSizeRef = useRef(0)

    if (!showPanel) return null

    {/* Panel handle classes */}
    const handleClass = {
        bottom: "cursor-ns-resize h-2 -top-2 w-full z-10",
        left: "cursor-ew-resize h-full -right-2 w-2 z-10",
        right: "cursor-ew-resize h-full -left-2 w-2 z-10"
    }[side]

    {/* Drag handlers */}
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!allowDragResize) return

        console.log('[Panel] Mouse down on handle', { side, isHorizontal })

        isDraggingRef.current = true
        startPosRef.current = isHorizontal ? e.clientX : e.clientY
        startSizeRef.current = size || (isHorizontal ? e.currentTarget.parentElement?.offsetWidth || 0 : e.currentTarget.parentElement?.offsetHeight || 0)

        console.log('[Panel] Initial state', {
            startPos: startPosRef.current,
            startSize: startSizeRef.current,
            currentSize: size
        })

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return

            const currentPos = isHorizontal ? e.clientX : e.clientY
            const delta = side === "left"
                ? currentPos - startPosRef.current
                : startPosRef.current - currentPos

            let newSize = startSizeRef.current + delta

            if (minSize !== undefined) newSize = Math.max(minSize, newSize)
            if (maxSize !== undefined) newSize = Math.min(maxSize, newSize)

            setSize(newSize)
        }

        const handleMouseUp = () => {
            console.log('[Panel] Mouse up')
            isDraggingRef.current = false
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    {/* Panel styles */}
    const panelStyle: React.CSSProperties = {}
    if (size !== undefined) {
        if (isHorizontal) {
            panelStyle.width = `${size}px`
        } else {
            panelStyle.height = `${size}px`
        }
    }

    return (
        <PanelContext.Provider value={{ setShowPanel, showPanel }}>
            <div
                aria-label="panel"
                className={`${border} border-(--du-bois-color-border) flex ${flexDirection} flex-shrink-0 relative`}
                style={panelStyle}
            >
                {allowDragResize && (
                    <div
                        aria-label="handle"
                        className={`hover:bg-sky-600/20 ${handleClass} absolute transition-colors`}
                        onMouseDown={handleMouseDown}
                    />
                )}

                {children}
            </div>
        </PanelContext.Provider>
    )
}

export { Panel, PanelContent, PanelTrigger }
