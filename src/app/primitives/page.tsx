"use client";

import React from "react";

import { Box } from "@/components/mini-patterns/box";
import { Button } from "@/components/mini-ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import "@/app/styles/styles.css";

interface PrimitiveProps {
    className?: string;
    component: React.ComponentType<{variant?: string; size?: string; children?: React.ReactNode}> | ((props: {variant?: string; size?: string; children?: React.ReactNode}) => React.ReactElement);
    description: string;
    size?: string[];
    style?: React.CSSProperties;
    variant?: string[];
}

export const primitives: Record<string, PrimitiveProps> = {
    box: {
        component: ({ className, size, ...props }: { className?: string; size?: string; [key: string]: unknown }) => (
            <Box className={className} size={size as "sm" | "default" | "lg" | undefined} {...props} />
        ),
        description: "Displays a box.",
        size: ["sm", "default", "lg"],
    },
    button: {
        component: ({ variant, children }: { variant?: string; children?: React.ReactNode }) => ( 
            <Button variant={variant as "default" | "destructive" | "ghost" | "link" | "outline" | "secondary"}>
                {children || "Button"}
            </Button>
        ),
        description: "Displays a button or a component that looks like a button.",
        size: ["default", "icon", "sm", "lg"],
        variant: ["default", "destructive", "ghost", "link", "outline", "secondary"],
    },
    tooltip: {
        component: ({ variant, children }: { variant?: string; children?: React.ReactNode }) => (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={variant as "default" | "destructive" | "ghost" | "link" | "outline" | "secondary"}>
                        {children || "Button"}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Tooltip content</TooltipContent>
            </Tooltip>
        ),
        description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
        variant: ["default"],
    },
};

export default function Page() {
    return (
        <div style={{ color: "var(--gray-700)", display: "flex", flexDirection: "column", gap: "40px", padding: "16px" }}>
            <div style={{ backgroundColor: "var(--gray-100)", borderRadius: "24px", padding: "48px" }}>
                <h1 style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "56px", fontWeight: 500 }}>Primitives</h1>
                <p style={{ fontSize: "20px" }}></p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {Object.entries(primitives).map(([primitiveName, primitiveData]) => {
                    const Component = primitiveData.component;
                    return (
                        <div key={primitiveName} style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                            <div>
                                <h2 style={{ fontSize: "24px", fontWeight: 600, textTransform: "capitalize", marginBottom: "4px" }}>{primitiveName}</h2>
                                <p style={{ fontSize: "16px", color: "var(--gray-500)" }}>{primitiveData.description}</p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                                {(primitiveData.variant || primitiveData.size || [null]).map((value: string | null) => {
                                        const propName = primitiveData.variant ? "variant" : "size";
                                        const propValue = value || (primitiveData.size ? "default" : undefined);
                                        return (
                                            <div key={value || "default"} style={{ display: "flex", flexDirection: "column", gap:"12px" }}>
                                                <h3 style={{ fontSize: "16px", fontWeight: 500, marginLeft: "2px", textTransform: "capitalize" }}>{value || "default"}</h3>
                                                <div style={{ alignItems: "center", background: "var(--white-800)", border: "1px solid var(--gray-100)", borderRadius: "16px", display: "flex", height: "400px", justifyContent: "center", maxWidth: "600px", padding: "24px" }}>
                                                    {React.createElement(Component as React.ComponentType<{variant?: string; size?: string; children?: React.ReactNode}>, {
                                                        key: value || "default",
                                                        ...(propName === "variant" ? { variant: propValue as string } : { size: propValue as "sm" | "default" | "lg" | undefined })
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}