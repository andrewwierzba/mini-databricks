"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export const colors = {
    black: {
        color: "white",
        hex: "#000000",
        oklch: "oklch(0.000 0.000 0.0)",
        rgb: "0, 0, 0"
    },
    "blue-100": {
        color: "black",
        hex: "#f0f8ff",
        oklch: "oklch(0.973 0.028 195.5)",
        rgb: "240, 248, 255"
    },
    "blue-200": {
        color: "black",
        hex: "#d7edfe",
        oklch: "oklch(0.933 0.046 223.4)",
        rgb: "215, 237, 254"
    },
    "blue-300": {
        color: "black",
        hex: "#bae1fc",
        oklch: "oklch(0.889 0.070 233.2)",
        rgb: "186, 225, 252"
    },
    "blue-400": {
        color: "black",
        hex: "#8acaff",
        oklch: "oklch(0.814 0.122 246.5)",
        rgb: "138, 202, 255"
    },
    "blue-500": {
        color: "black",
        hex: "#4299e0",
        oklch: "oklch(0.660 0.162 251.1)",
        rgb: "66, 153, 224"
    },
    "blue-600": {
        color: "white",
        hex: "#2272b4",
        oklch: "oklch(0.537 0.153 253.1)",
        rgb: "34, 114, 180"
    },
    "blue-700": {
        color: "white",
        hex: "#0e538b",
        oklch: "oklch(0.432 0.134 254.2)",
        rgb: "14, 83, 139"
    },
    "blue-800": {
        color: "white",
        hex: "#04355d",
        oklch: "oklch(0.322 0.103 254.5)",
        rgb: "4, 53, 93"
    },
    primary: {
        color: "black",
        hex: "",
        oklch: "",
        rgb: ""
    },
    secondary: {
        color: "black",
        hex: "",
        oklch: "",
        rgb: ""
    },
    white: {
        color: "black",
        hex: "#ffffff",
        oklch: "oklch(0.998 0.026 160.7)",
        rgb: "255, 255, 255"
    }
};

export default function Page() {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", padding: "16px" }}>
            {Object.entries(colors).map(([name, color]) => (
                <div aria-label="color" key={name} style={{ backgroundColor: color.hex, color: colors[color.color as keyof typeof colors]?.hex, display: "flex", gap: "8px", height: "200px", padding: "16px", width: "200px" }}>
                    <div style={{ display: "flex", flex: "1", flexDirection: "column", fontFamily: "var(--font-dm-sans)", gap: "4px" }}>
                        <strong style={{ fontSize: "16px" }}>{name}</strong>
                        {Object.entries(color).map(([format, value]) => (
                            <div key={format} style={{ fontSize: "12px" }}>{format.toUpperCase()} {value}</div>
                        ))}
                    </div>
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(color.hex);
                            toast.success(`Copied ${color.hex}`);
                        }}
                        size="icon"
                        variant="outline"
                    >
                        <Copy />
                    </Button>
                </div>
            ))}
        </div>
    );
}