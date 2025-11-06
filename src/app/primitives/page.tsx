"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import "@/app/styles/styles.css";

export const PrimitiveButton = React.forwardRef<
    HTMLButtonElement,
    { children?: React.ReactNode; size?: string; variant?: string; className?: string }
>(({ children, size, variant = "default", className, ...props }, ref) => {
    const baseClasses = {
        default: "bg-[var(--blue-600)] hover:bg-[var(--blue-700)] active:bg-[var(--blue-800)] text-[var(--white-800)]",
        destructive: "bg-[var(--red-600)] hover:bg-[var(--red-700)] active:bg-[var(--red-800)] text-[var(--white-800)]",
        ghost: "bg-transparent hover:bg-[var(--blue-100)] active:bg-[var(--blue-200)] text-[var(--blue-600)]",
        link: "bg-transparent hover:bg-transparent active:bg-transparent text-[var(--blue-600)]",
        outline: "bg-transparent hover:bg-[var(--blue-100)] active:bg-[var(--blue-200)] text-[var(--black-800)] border border-[var(--black-800)]",
        secondary: "bg-[var(--black-400)] hover:bg-[var(--black-500)] active:bg-[var(--black-600)] text-[var(--white-800)]"
    };

    const baseVariant = !variant || variant === "default" || variant === "primary" 
        ? "default" 
        : variant;

    const classes = baseClasses[variant as keyof typeof baseClasses] || baseClasses.default;

    return (
        <Button
            ref={ref}
            className={`${classes} ${className || ""}`}
            size={size as any}
            variant={baseVariant as any}
            {...props}
        >
            {children || "Button"}
        </Button>
    );
});

PrimitiveButton.displayName = "PrimitiveButton";

interface PrimitiveProps {
    className?: string;
    component: React.ComponentType<any> | ((props: any) => React.ReactElement);
    description: string;
    size?: string[];
    style?: React.CSSProperties;
    variant?: string[];
}

export const primitives: Record<string, PrimitiveProps> = {
    button: {
        component: PrimitiveButton,
        description: "Displays a button or a component that looks like a button.",
        size: ["default", "icon", "sm", "lg"],
        variant: ["default", "destructive", "ghost", "link", "outline", "secondary"],
    },
    tooltip: {
        component: ({ variant, children }: { variant?: string; children?: React.ReactNode }) => (
            <Tooltip>
                <TooltipTrigger asChild>
                    <PrimitiveButton variant={variant as any} />
                </TooltipTrigger>
                <TooltipContent>Tooltip Content</TooltipContent>
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
                                {(primitiveData as any).variant.map((variant: string) => {
                                        return (
                                            <div key={variant} style={{ display: "flex", flexDirection: "column", gap:"12px" }}>
                                                <h3 style={{ fontSize: "16px", fontWeight: 500, marginLeft: "2px", textTransform: "capitalize" }}>{variant}</h3>
                                                <div style={{ alignItems: "center", background: "var(--white-800)", border: "1px solid var(--gray-100)", borderRadius: "16px", display: "flex", height: "400px", justifyContent: "center", maxWidth: "600px", padding: "24px" }}>
                                                    {React.createElement(Component as any, {
                                                        key: variant,
                                                        variant: variant
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