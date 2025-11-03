"use client";

import { colors } from "@/app/styles/colors/page";

import { Button } from "@/components/ui/button";

export const primitives = {
    button: {
        component: Button,
        description: "Displays a button or a component that looks like a button.",
        size: ["default", "sm", "lg"],
        variant: ["default", "destructive", "ghost", "link", "outline", "secondary"],
    },
};

const getVariantStyle = (primitiveName: string, variant: string) => {
    const baseStyle: React.CSSProperties = {
        borderRadius: "4px",
    };

    if (primitiveName === "button") {
        if (variant === "default") {
            return {
                ...baseStyle,
                backgroundColor: colors.blue["blue-600"].hex,
                color: colors.white["white-800"].hex,
                border: "none",
            };
        }
        if (variant === "destructive") {
            return {
                ...baseStyle,
                backgroundColor: colors.red["red-600"].hex,
                color: colors.white["white-800"].hex,
                border: "none",
            };
        }
    }

    return baseStyle;
};

export default function Page() {
    return (
        <div style={{ color: "#26251e", display: "flex", flexDirection: "column", gap: "40px", padding: "16px" }}>
            <div style={{ backgroundColor: "#f2f1ed", borderRadius: "24px", padding: "48px" }}>
                <h1 style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "56px", fontWeight: 500 }}>Primitives</h1>
                <p style={{ fontSize: "20px" }}>Comprehensive color system for designing beautiful, accessible websites and apps.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {Object.entries(primitives).map(([primitiveName, primitiveData]) => {
                    const Component = primitiveData.component;
                    return (
                        <div key={primitiveName} style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                            <div>
                                <h2 style={{ fontSize: "24px", fontWeight: 600, textTransform: "capitalize", marginBottom: "4px" }}>{primitiveName}</h2>
                                <p style={{ fontSize: "16px", color: "#5f7281" }}>{primitiveData.description}</p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                                {primitiveData.variant.map((variant: string) => (
                                    <div style={{ display: "flex", flexDirection: "column", gap:"12px" }} key={variant}>
                                        <h3 style={{ fontSize: "16px", fontWeight: 500, marginLeft: "2px", textTransform: "capitalize" }}>{variant}</h3>
                                        <div style={{ alignItems: "center", background: "#ffffff", border: "1px solid #f2f1ed", borderRadius: "16px", display: "flex", height: "400px", justifyContent: "center", maxWidth: "600px", padding: "24px" }}>
                                            <Component
                                                key={variant}
                                                style={getVariantStyle(primitiveName, variant)}
                                                variant={variant as any}
                                            >
                                                {variant}
                                            </Component>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}