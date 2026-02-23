"use client";

import { createContext, useContext, useEffect, useState, Children, isValidElement, cloneElement } from "react";
import { createPortal } from "react-dom";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface ContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const Context = createContext<ContextType | null>(null);

function useDialogContext(): ContextType {
    const context = useContext(Context);
    if (!context) {
        throw new Error("Dialog components must be used within a Dialog");
    }
    return context;
}

interface Props {
    children?: React.ReactNode;
    defaultDepth?: number;
    open?: boolean;
}

interface ExtendedProps extends Props {
    onOpenChange?: (open: boolean) => void;
    setDepth?: (defaultDepth: number | ((prev: number) => number)) => void;
}

export function Dialog({ children, defaultDepth = 0, open: controlledOpen, onOpenChange, setDepth }: ExtendedProps) {
    const [mounted, setMounted] = useState(false);
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    const regularChildren = Children.toArray(children).filter(
        (child) => !(isValidElement(child) && child.type === DialogContent)
    );

    if (!mounted) {
        return (
            <Context.Provider value={{ open, setOpen }}>
                {regularChildren}
            </Context.Provider>
        );
    }

    const contentChildren = Children.toArray(children)
        .filter((child) => isValidElement(child) && child.type === DialogContent)
        .map((child) => {
            if (isValidElement(child) && child.type === DialogContent) {
                return cloneElement(child as React.ReactElement<{ className?: string; defaultDepth?: number; }>, {
                    defaultDepth,
                    className: cn((child.props as { className?: string }).className, defaultDepth > 0 ? "shadow-sm" : "shadow-none"),
                });
            }
            return child;
        });

    return (
        <Context.Provider value={{ open, setOpen }}>
            {regularChildren}
            {open && createPortal(
                <>
                    <div
                        aria-label="dialog-overlay" 
                        className="bg-black/50 inset-0 fixed z-50"
                        onClick={() => {
                            if (setDepth) {
                                const currentDepth = defaultDepth ?? 0;
                                if (currentDepth === 0) {
                                    setOpen(false);
                                } else {
                                    setDepth(currentDepth - 1);
                                }
                            } else {
                                setOpen(false);
                            }
                        }}
                    />
                    {contentChildren}
                </>,
                document.body
            )}
        </Context.Provider>
    );
}

function DialogClose({ asChild, children, ...props }: { asChild?: boolean, children?: React.ReactNode } & React.ComponentProps<"button">) {
    const { setOpen } = useDialogContext();

    if (asChild) {
        return (
            <Slot
                onClick={() => setOpen(false)}
                data-slot="dialog-close"
                {...props}
            >
                {children}
            </Slot>
        );
    }

    return <button onClick={() => setOpen(false)} data-slot="dialog-close" {...props}>{children}</button>;
}

function DialogContent({ children, className, defaultDepth, ...props }: { children?: React.ReactNode, className?: string, defaultDepth?: number } & React.ComponentProps<"div">) {
    return (
        <div className="left-[50%] max-w-[calc(100%-2rem)] sm:max-w-[600px] fixed top-[50%] translate-x-[-50%] translate-y-[-50%] w-full z-50">
            {(defaultDepth ?? 0) > 0 && (
                <div className="h-full left-0 p-2 absolute top-4 w-full z-40">
                    <div className="bg-white border border-gray-200 rounded-lg h-full" />
                </div>
            )}
            <div
                aria-label="dialog-content"
                className={cn(
                    "bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col gap-4 max-h-[90vh] p-6 w-full z-50 relative",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>
    );
}

function DialogDescription({ children, className, ...props }: { children?: React.ReactNode, className?: string } & React.ComponentProps<"div">) {
    return (
        <div
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function DialogFooter({ children, className, ...props }: { children?: React.ReactNode, className?: string } & React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function DialogHeader({ children, className, ...props }: { children?: React.ReactNode, className?: string } & React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex flex-col gap-2 text-center sm:text-left",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function DialogTitle({ children, className, ...props }: { children?: React.ReactNode, className?: string } & React.ComponentProps<"div">) {
    return (
        <div
            className={cn("text-lg leading-none font-semibold", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function DialogTrigger({ asChild, children, className, ...props }: { asChild?: boolean, children?: React.ReactNode, className?: string } & React.ComponentProps<"button">) {
    const { setOpen } = useDialogContext();

    if (asChild) {
        return (
            <Slot
                className={cn(className)}
                onClick={() => setOpen(true)}
                {...props}
            >
                {children}
            </Slot>
        );
    }

    return (
        <Button
            className={cn(className)}
            onClick={() => setOpen(true)}
            variant="outline"
            {...props}
        >
            {children}
        </Button>
    );
}

export {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
};

