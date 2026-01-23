"use client";

import { useState } from "react";

import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export const colors = {
    black: {
        "black-100": {
            contrast: "black-800",
            hex: "#0000000D",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.05",
            usage: "Shadows, highlights, and overlays.",
        },
        "black-200": {
            contrast: "black-800",
            hex: "#0000001A",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.1",
            usage: "Shadows, highlights, and overlays.",
        },
        "black-300": {
            contrast: "black-800",
            hex: "#00000033",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.2",
            usage: "Shadows, highlights, and overlays.",
        },
        "black-400": {
            contrast: "black-800",
            hex: "#00000066",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.4",
            usage: "Shadows, highlights, and overlays.",
        },
        "black-500": {
            contrast: "white-800",
            hex: "#00000080",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.5",
            usage: "Shadows, highlights, and overlays.",
        },
        "black-600": {
            contrast: "white-800",
            hex: "#00000099",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.6",
            usage: "Shadows, highlights, and overlays.",
        },
        "black-700": {
            contrast: "white-800",
            hex: "#000000CC",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.8",
            usage: "Shadows, highlights, and overlays.",
        },
        "black-800": {
            contrast: "white-800",
            hex: "#000000FF",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 1.0",
            usage: "Shadows, overlays, and text.",
        },
    },
    blue: {
        "blue-100": {
            hex: "#f0f8ff",
            oklch: "oklch(0.9751 0.0127 244.25)",
            rgb: "240, 248, 255",
        },
        "blue-200": {
            hex: "#d7edfe",
            oklch: "oklch(0.9351 0.0328 241.07)",
            rgb: "215, 237, 254",
        },
        "blue-300": {
            hex: "#bae1fc",
            oklch: "oklch(0.8907 0.0553 238.47)",
            rgb: "186, 225, 252",
        },
        "blue-400": {
            hex: "#8acaff",
            oklch: "oklch(0.8156 0.099658 244.4315)",
            rgb: "138, 202, 255",
        },
        "blue-500": {
            hex: "#4299e0",
            oklch: "oklch(0.6621 0.1346 246.46)",
            rgb: "66, 153, 224",
        },
        "blue-600": {
            hex: "#2272b4",
            oklch: "oklch(0.5381 0.1277 248.22)",
            rgb: "34, 114, 180",
            usage: "Buttons and links.",
        },
        "blue-700": {
            contrast: ["white-800"],
            hex: "#0e538b",
            oklch: "oklch(0.4331 0.1123 249.25)",
            rgb: "14, 83, 139",
            usage: "Button hover state.",
        },
        "blue-800": {
            contrast: ["white-800"],
            hex: "#04355d",
            oklch: "oklch(0.3226 0.086 249.43)",
            rgb: "4, 53, 93",
            usage: "Button pressed state.",
        },
    },
    green: {
        "green-100": {
            contrast: ["green-600"],
            hex: "#f3fcf6",
            oklch: "oklch(0.9827 0.0123 157.01)",
            rgb: "243, 252, 246",
            usage: "Backgrounds.",
        },
        "green-200": {
            hex: "#d4f7df",
            oklch: "oklch(0.9446 0.0485 155.41)",
            rgb: "212, 247, 223",
        },
        "green-300": {
            hex: "#b1ecc5",
            oklch: "oklch(0.8924 0.0804 155.49)",
            rgb: "177, 236, 197",
            usage: "Borders and separators.",
        },
        "green-400": {
            hex: "#8ddda8",
            oklch: "oklch(0.8317 0.1088 154.35)",
            rgb: "141, 221, 168",
        },
        "green-500": {
            hex: "#3ba65e",
            oklch: "oklch(0.646 0.1445 150.88)",
            rgb: "59, 166, 94",
        },
        "green-600": {
            hex: "#277c43",
            oklch: "oklch(0.5211 0.1199 150.66)",
            rgb: "39, 124, 67",
            usage: "Icons and text.",
        },
        "green-700": {
            hex: "#115026",
            oklch: "oklch(0.3812 0.0937 150.03)",
            rgb: "17, 80, 38",
        },
        "green-800": {
            hex: "#093919",
            oklch: "oklch(0.3044 0.0753 149.95)",
            rgb: "9, 57, 25",
        },
    },
    gray: {
        "gray-100": {
            hex: "#e8ecf0",
            oklch: "oklch(0.9412 0.0069 247.9)",
            rgb: "232, 236, 240",
        },
        "gray-200": {
            hex: "#d1d9e1",
            oklch: "oklch(0.8815 0.014 247.99)",
            rgb: "209, 217, 225",
            usage: "Backgrounds, borders, and separators.",
        },
        "gray-300": {
            hex: "#c0cdd8",
            oklch: "oklch(0.8417 0.0209 243.46)",
            rgb: "192, 205, 216",
        },
        "gray-400": {
            hex: "#8396a5",
            oklch: "oklch(0.6632 0.0311 241.84)",
            rgb: "131, 150, 165",
        },
        "gray-500": {
            hex: "#5f7281",
            oklch: "oklch(0.5421 0.0326 242.04)",
            rgb: "95, 114, 129",
        },
        "gray-600": {
            hex: "#445461",
            oklch: "oklch(0.4373 0.0294 242.94)",
            rgb: "68, 84, 97",
            usage: "Text.",
        },
        "gray-700": {
            hex: "#1f272d",
            oklch: "oklch(0.2676 0.016 240.62)",
            rgb: "31, 39, 45",
        },
        "gray-800": {
            hex: "#11171c",
            oklch: "oklch(0.2008 0.0136 243.63)",
            rgb: "17, 23, 28",
        },
    },
    red: {
        "red-100": {
            contrast: ["red-600"],
            hex: "#fff5f7",
            oklch: "oklch(0.9785 0.011 3.49)",
            rgb: "255, 245, 247",
            usage: "Backgrounds.",
        },
        "red-200": {
            hex: "#fde2e8",
            oklch: "oklch(0.9364 0.0306 2.59)",
            rgb: "253, 226, 232",
        },
        "red-300": {
            hex: "#fbd0d8",
            oklch: "oklch(0.8966 0.0494 5.56)",
            rgb: "251, 208, 216",
            usage: "Borders and separators.",
        },
        "red-400": {
            hex: "#f792a6",
            oklch: "oklch(0.7709 0.1233 7.61)",
            rgb: "247, 146, 166",
        },
        "red-500": {
            hex: "#e65b77",
            oklch: "oklch(0.6572 0.1732 10.93)",
            rgb: "230, 91, 119",
        },
        "red-600": {
            hex: "#c82d4c",
            oklch: "oklch(0.5515 0.1897 15.38)",
            rgb: "200, 45, 76",
            usage: "Icons and text."
        },
        "red-700": {
            hex: "#9e102c",
            oklch: "oklch(0.4492 0.1712 19.14)",
            rgb: "158, 16, 44",
        },
        "red-800": {
            hex: "#630316",
            oklch: "oklch(0.3184 0.1247 19.68)",
            rgb: "99, 3, 22",
        },
    },
    yellow: {
        "yellow-100": {
            contrast: ["yellow-600"],
            hex: "#fff9eb",
            oklch: "oklch(0.983 0.0195 87.51)",
            rgb: "255, 249, 235",
            usage: "Backgrounds.",
        },
        "yellow-200": {
            hex: "#fceaca",
            oklch: "oklch(0.9433 0.0462 82.04)",
            rgb: "252, 234, 202",
        },
        "yellow-300": {
            hex: "#f8d4a5",
            oklch: "oklch(0.8892 0.0732 74.04)",
            rgb: "248, 212, 165",
            usage: "Borders and separators.",
        },
        "yellow-400": {
            hex: "#f2be88",
            oklch: "oklch(0.8359 0.0919 67.08)",
            rgb: "242, 190, 136",
        },
        "yellow-500": {
            hex: "#de7921",
            oklch: "oklch(0.6768 0.1555 55.23)",
            rgb: "222, 121, 33",
        },
        "yellow-600": {
            hex: "#be501e",
            oklch: "oklch(0.5673 0.1541 41.94)",
            rgb: "190, 80, 30",
            usage: "Icons and text."
        },
        "yellow-700": {
            hex: "#93320b",
            oklch: "oklch(0.4547 0.1385 38.87)",
            rgb: "147, 50, 11",
        },
        "yellow-800": {
            hex: "#5f1b02",
            oklch: "oklch(0.3295 0.1042 38.42)",
            rgb: "95, 27, 2",
        },
    },
    white: {
        "white-100": {
            contrast: "black-800",
            hex: "#ffffff0D",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.05",
            usage: "Shadows, highlights, and overlays.",
        },
        "white-200": {
            contrast: "black-800",
            hex: "#ffffff1A",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.1",
            usage: "Shadows, highlights, and overlays.",
        },
        "white-300": {
            contrast: "black-800",
            hex: "#ffffff33",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.2",
            usage: "Shadows, highlights, and overlays.",
        },
        "white-400": {
            contrast: "black-800",
            hex: "#ffffff66",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.4",
            usage: "Shadows, highlights, and overlays.",
        },
        "white-500": {
            contrast: "black-800",
            hex: "#ffffff80",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.5",
            usage: "Shadows, highlights, and overlays.",
        },
        "white-600": {
            contrast: "black-800",
            hex: "#ffffff99",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.6",
            usage: "Shadows, highlights, and overlays.",
        },
        "white-700": {
            contrast: "black-800",
            hex: "#ffffffCC",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.8",
            usage: "Shadows, highlights, and overlays.",
        },
        "white-800": {
            contrast: "black-800",
            hex: "#ffffffff",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 1.0",
            usage: "Shadows, overlays, and text.",
        }
    }
};

export default function Page() {
    const [selectedColor, setSelectedColor] = useState<{ name: string; data: {contrast?: string | string[]; hex: string; oklch: string; rgb: string; usage?: string}; group: string } | null>(null);

    return (
        <div style={{ color: "#26251e", display: "flex", flexDirection: "column", gap: "40px", padding: "16px" }}>
            <div style={{ backgroundColor: "#f2f1ed", borderRadius: "24px", padding: "48px" }}>
                <h1 style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "56px", fontWeight: 500 }}>Color styles</h1>
                <p style={{ fontSize: "20px" }}>Comprehensive color system for designing beautiful, accessible websites and apps.</p>
                <Button style={{ marginTop: "24px" }}>
                    Download markdown
                    <DownloadIcon />
                </Button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", gap: "4px", paddingLeft: "80px" }}>
                    <h2 style={{ minWidth: "80px", textAlign: "center" }}>100</h2>
                    <h2 style={{ minWidth: "80px", textAlign: "center" }}>200</h2>
                    <h2 style={{ minWidth: "80px", textAlign: "center" }}>300</h2>
                    <h2 style={{ minWidth: "80px", textAlign: "center" }}>400</h2>
                    <h2 style={{ minWidth: "80px", textAlign: "center" }}>500</h2>
                    <h2 style={{ minWidth: "80px", textAlign: "center" }}>600</h2>
                    <h2 style={{ minWidth: "80px", textAlign: "center" }}>700</h2>
                    <h2 style={{ minWidth: "80px", textAlign: "center" }}>800</h2>
                </div>
                {Object.entries(colors).map(([groupName, group]) => (
                    <div key={groupName} style={{ alignItems: "center", display: "flex", gap: "8px" }}>
                        <h2 style={{ fontWeight: 500, minWidth: "72px", textTransform: "capitalize" }}>{groupName}</h2>
                        <div style={{ display: "flex", gap: "4px" }}>
                            {Object.entries(group).map(([colorName, colorData]) => (
                                <div
                                    aria-label="color"
                                    key={colorName}
                                    onClick={() => {
                                        setSelectedColor({ name: colorName, data: colorData, group: groupName });
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.outline = "2px solid #26251e";
                                        e.currentTarget.style.cursor = "pointer";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.outline = "none";
                                        e.currentTarget.style.cursor = "default";
                                    }}
                                    style={{
                                        backgroundImage: `linear-gradient(${colorData.hex}, ${colorData.hex}), linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1)), linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1))`,
                                        backgroundSize: "100% 100%, 16px 16px, 16px 16px",
                                        backgroundPosition: "0 0, 0 0, 8px 8px",
                                        height: "48px",
                                        minWidth: "80px"
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={!!selectedColor} onOpenChange={(open) => !open && setSelectedColor(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle style={{ textTransform: "capitalize" }}>
                            {selectedColor?.name.replace(/-/g, " ")}
                        </DialogTitle>
                        <DialogDescription>
                            Color details and usage information
                        </DialogDescription>
                    </DialogHeader>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div
                            style={{
                                backgroundImage: `linear-gradient(${selectedColor?.data.hex}, ${selectedColor?.data.hex}), linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1)), linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1))`,
                                backgroundSize: "100% 100%, 16px 16px, 16px 16px",
                                backgroundPosition: "0 0, 0 0, 8px 8px",
                                borderRadius: "8px",
                                height: "120px",
                                width: "100%",
                            }}
                        />
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {selectedColor?.data.usage && (
                                <>
                                    <div>
                                        <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Usage</p>
                                        <p style={{ fontSize: "14px", opacity: 0.8 }}>{selectedColor?.data.usage}</p>
                                    </div>
                                    <Separator />
                                </>
                            )}
                            <div>
                                <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Hex</p>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(selectedColor?.data.hex || "");
                                        toast.success(`Copied ${selectedColor?.data.hex}`);
                                    }}
                                    style={{ justifyContent: "space-between", width: "100%" }}
                                    variant="outline"
                                >
                                    {selectedColor?.data.hex}
                                    <span style={{ fontSize: "12px", opacity: 0.6 }}>Click to copy</span>
                                </Button>
                            </div>
                            <div>
                                <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>RGB</p>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(selectedColor?.data.rgb || "");
                                        toast.success(`Copied ${selectedColor?.data.rgb}`);
                                    }}
                                    style={{ justifyContent: "space-between", width: "100%" }}
                                    variant="outline"
                                >
                                    {selectedColor?.data.rgb}
                                    <span style={{ fontSize: "12px", opacity: 0.6 }}>Click to copy</span>
                                </Button>
                            </div>
                            <div>
                                <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>OKLCH</p>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(selectedColor?.data.oklch || "");
                                        toast.success(`Copied ${selectedColor?.data.oklch}`);
                                    }}
                                    style={{ justifyContent: "space-between", width: "100%" }}
                                    variant="outline"
                                >
                                    {selectedColor?.data.oklch}
                                    <span style={{ fontSize: "12px", opacity: 0.6 }}>Click to copy</span>
                                </Button>
                            </div>
                            {selectedColor?.data.contrast && (() => {
                                // Normalize contrast to always be an array
                                const contrastColors = Array.isArray(selectedColor.data.contrast) 
                                    ? selectedColor.data.contrast 
                                    : [selectedColor.data.contrast];
                                
                                return (
                                    <>
                                        <Separator />
                                        <div>
                                            <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Contrast</p>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                                {contrastColors.map((contrastColorName: string) => {
                                                    const contrastFamily = contrastColorName.split('-')[0] as keyof typeof colors;
                                                    const contrastHex = (colors[contrastFamily] as Record<string, {contrast?: string | string[]; hex: string; oklch: string; rgb: string; usage?: string}>)?.[contrastColorName]?.hex || '#ffffff';
                                                    
                                                    return (
                                                        <div 
                                                            key={contrastColorName}
                                                            style={{ alignItems: "center", border: "1px solid #e8ecf0", borderRadius: "8px", display: "flex", gap: "8px", padding: "4px" }}
                                                        >
                                                            <div style={{ display: "flex", border: "1px solid #e8ecf0", borderRadius: "4px", overflow: "hidden", height: "24px", width: "24px" }}>
                                                                <div
                                                                    style={{
                                                                        backgroundImage: `linear-gradient(${contrastHex}, ${contrastHex}), linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1)), linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1))`,
                                                                        backgroundSize: "100% 100%, 8px 8px, 8px 8px",
                                                                        backgroundPosition: "0 0, 0 0, 4px 4px",
                                                                        height: "100%",
                                                                        width: "50%",
                                                                    }}
                                                                />
                                                                <div
                                                                    style={{
                                                                        backgroundImage: `linear-gradient(${selectedColor?.data.hex}, ${selectedColor?.data.hex}), linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1)), linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1))`,
                                                                        backgroundSize: "100% 100%, 8px 8px, 8px 8px",
                                                                        backgroundPosition: "0 0, 0 0, 4px 4px",
                                                                        height: "100%",
                                                                        width: "50%",
                                                                    }}
                                                                />
                                                            </div>
                                                            <span style={{ fontSize: "14px" }}>{contrastColorName}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}