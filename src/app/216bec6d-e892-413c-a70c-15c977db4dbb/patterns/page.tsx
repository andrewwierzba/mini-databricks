"use client";

import { createContext, useContext, useEffect, useState, Children, isValidElement, cloneElement } from "react";
import { createPortal } from "react-dom";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface DialogContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

function useDialogContext() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("Dialog components must be used within a Dialog");
    }
    return context;
}

interface Props {
    children?: React.ReactNode;
    depth?: number;
    setDepth?: (depth: number | ((prev: number) => number)) => void;
}

export function Dialog({ children, depth = 0, setDepth }: Props) {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const regularChildren = Children.toArray(children).filter(
        (child) => !(isValidElement(child) && child.type === DialogContent)
    );

    if (!mounted) {
        return (
            <DialogContext.Provider value={{ open, setOpen }}>
                {regularChildren}
            </DialogContext.Provider>
        );
    }

    const contentChildren = Children.toArray(children)
        .filter((child) => isValidElement(child) && child.type === DialogContent)
        .map((child) => {
            if (isValidElement(child) && child.type === DialogContent) {
                return cloneElement(child as React.ReactElement<{ className?: string; depth?: number }>, {
                    depth,
                    className: cn((child.props as { className?: string }).className, depth > 0 ? "shadow-sm" : "shadow-none"),
                });
            }
            return child;
        });

    return (
        <DialogContext.Provider value={{ open, setOpen }}>
            {regularChildren}
            {open && createPortal(
                <>
                    <div
                        aria-label="dialog-overlay" 
                        className="bg-black/50 inset-0 fixed z-50"
                        onClick={() => {
                            if (setDepth) {
                                const currentDepth = depth ?? 0;
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
        </DialogContext.Provider>
    );
}

function DialogContent({ children, className, depth, ...props }: { children?: React.ReactNode, className?: string, depth?: number } & React.ComponentProps<"div">) {
    return (
        <div className="left-[50%] max-w-md fixed top-[50%] translate-x-[-50%] translate-y-[-50%] w-full z-50">
            {(depth ?? 0) > 0 && (
                <div className="h-full left-0 p-2 absolute top-4 w-full z-40">
                    <div className="bg-white border rounded-lg h-full" />
                </div>
            )}
            <div
                aria-label="dialog-content"
                className={cn(
                    "bg-white border shadow-sm rounded-lg max-h-[90vh] max-w-md p-6 w-full z-50 relative",
                    className
                )}
                {...props}
            >
                {children}
            </div>

            {/* <div aria-label="dialog-content" className={cn("bg-white border shadow-sm rounded-lg left-[50%] max-h-[90vh] max-w-md p-6 fixed top-[50%] translate-x-[-50%] translate-y-[-50%] w-full z-50", className)}>
                <Button variant="outline">Open</Button>
            </div> */}
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

export default function Page() {
    const [depth, setDepth] = useState(0);

    return (
        <div>
            <Dialog depth={depth} setDepth={setDepth}>
                <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        Dialog Title
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={() => setDepth(1)}>Add depth</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
