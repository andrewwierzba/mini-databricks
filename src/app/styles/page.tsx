"use client";

import { toast } from "sonner";

export const colors = {
    black: {
        "black-100": {
            contrast: "white",
            hex: "#0000000D",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.05"
        },
        "black-200": {
            contrast: "white",
            hex: "#0000001A",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.1"
        },
        "black-300": {
            contrast: "white",
            hex: "#00000033",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.2"
        },
        "black-400": {
            contrast: "white",
            hex: "#00000066",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.4"
        },
        "black-500": {
            contrast: "white",
            hex: "#00000080",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.5"
        },
        "black-600": {
            contrast: "white",
            hex: "#00000099",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.6"
        },
        "black-700": {
            contrast: "white",
            hex: "#000000CC",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 0.8"
        },
        "black-800": {
            contrast: "white",
            hex: "#000000FF",
            oklch: "oklch(0.000 0.000 0.0)",
            rgb: "0, 0, 0, 1.0"
        },
    },
    blue: {
        "blue-100": {
            contrast: "black",
            hex: "#f0f8ff",
            oklch: "oklch(0.973 0.028 195.5)",
            rgb: "240, 248, 255"
        },
        "blue-200": {
            contrast: "black",
            hex: "#d7edfe",
            oklch: "oklch(0.933 0.046 223.4)",
            rgb: "215, 237, 254"
        },
        "blue-300": {
            contrast: "black",
            hex: "#bae1fc",
            oklch: "oklch(0.889 0.070 233.2)",
            rgb: "186, 225, 252"
        },
        "blue-400": {
            contrast: "black",
            hex: "#8acaff",
            oklch: "oklch(0.814 0.122 246.5)",
            rgb: "138, 202, 255"
        },
        "blue-500": {
            contrast: "black",
            hex: "#4299e0",
            oklch: "oklch(0.660 0.162 251.1)",
            rgb: "66, 153, 224"
        },
        "blue-600": {
            contrast: "white",
            hex: "#2272b4",
            oklch: "oklch(0.537 0.153 253.1)",
            rgb: "34, 114, 180"
        },
        "blue-700": {
            contrast: "white",
            hex: "#0e538b",
            oklch: "oklch(0.432 0.134 254.2)",
            rgb: "14, 83, 139"
        },
        "blue-800": {
            contrast: "white",
            hex: "#04355d",
            oklch: "oklch(0.322 0.103 254.5)",
            rgb: "4, 53, 93"
        },
    },
    green: {
        "green-100": {
            contrast: "black",
            hex: "#f3fcf6",
            oklch: "oklch(0.981 0.039 158.5)",
            rgb: "243, 252, 246"
        },
        "green-200": {
            contrast: "black",
            hex: "#d4f7df",
            oklch: "oklch(0.943 0.078 155.0)",
            rgb: "212, 247, 223"
        },
        "green-300": {
            contrast: "black",
            hex: "#b1ecc5",
            oklch: "oklch(0.890 0.112 154.1)",
            rgb: "177, 236, 197"
        },
        "green-400": {
            contrast: "black",
            hex: "#8ddda8",
            oklch: "oklch(0.830 0.143 152.5)",
            rgb: "141, 221, 168"
        },
        "green-500": {
            contrast: "black",
            hex: "#3ba65e",
            oklch: "oklch(0.645 0.184 148.2)",
            rgb: "59, 166, 94"
        },
        "green-600": {
            contrast: "white",
            hex: "#277c43",
            oklch: "oklch(0.520 0.153 147.9)",
            rgb: "39, 124, 67"
        },
        "green-700": {
            contrast: "white",
            hex: "#115026",
            oklch: "oklch(0.380 0.119 147.1)",
            rgb: "17, 80, 38"
        },
        "green-800": {
            contrast: "white",
            hex: "#093919",
            oklch: "oklch(0.304 0.096 147.0)",
            rgb: "9, 57, 25"
        },
    },
    grey: {
        "grey-100": {
            contrast: "black",
            hex: "#e8ecf0",
            oklch: "oklch(0.939 0.024 182.0)",
            rgb: "232, 236, 240"
        },
        "grey-200": {
            contrast: "black",
            hex: "#d1d9e1",
            oklch: "oklch(0.880 0.026 203.3)",
            rgb: "209, 217, 225"
        },
        "grey-300": {
            contrast: "black",
            hex: "#c0cdd8",
            oklch: "oklch(0.840 0.032 215.3)",
            rgb: "192, 205, 216"
        },
        "grey-400": {
            contrast: "white",
            hex: "#8396a5",
            oklch: "oklch(0.662 0.041 230.9)",
            rgb: "131, 150, 165"
        },
        "grey-500": {
            contrast: "white",
            hex: "#5f7281",
            oklch: "oklch(0.541 0.042 235.8)",
            rgb: "95, 114, 129"
        },
        "grey-600": {
            contrast: "white",
            hex: "#445461",
            oklch: "oklch(0.436 0.037 238.4)",
            rgb: "68, 84, 97"
        },
        "grey-700": {
            contrast: "white",
            hex: "#1f272d",
            oklch: "oklch(0.267 0.020 234.4)",
            rgb: "31, 39, 45"
        },
        "grey-800": {
            contrast: "white",
            hex: "#11171c",
            oklch: "oklch(0.200 0.017 239.1)",
            rgb: "17, 23, 28"
        },
    },
    red: {
        "red-100": {
            contrast: "black",
            hex: "#fff5f7",
            oklch: "oklch(0.977 0.016 142.6)",
            rgb: "255, 245, 247"
        },
        "red-200": {
            contrast: "black",
            hex: "#fde2e8",
            oklch: "oklch(0.935 0.014 57.7)",
            rgb: "253, 226, 232"
        },
        "red-300": {
            contrast: "black",
            hex: "#fbd0d8",
            oklch: "oklch(0.895 0.031 33.5)",
            rgb: "251, 208, 216"
        },
        "red-400": {
            contrast: "black",
            hex: "#f792a6",
            oklch: "oklch(0.770 0.105 21.0)",
            rgb: "247, 146, 166"
        },
        "red-500": {
            contrast: "white",
            hex: "#e65b77",
            oklch: "oklch(0.656 0.157 25.0)",
            rgb: "230, 91, 119"
        },
        "red-600": {
            contrast: "white",
            hex: "#c82d4c",
            oklch: "oklch(0.551 0.179 33.3)",
            rgb: "200, 45, 76"
        },
        "red-700": {
            contrast: "white",
            hex: "#9e102c",
            oklch: "oklch(0.449 0.168 41.5)",
            rgb: "158, 16, 44"
        },
        "red-800": {
            contrast: "white",
            hex: "#630316",
            oklch: "oklch(0.318 0.123 43.0)",
            rgb: "99, 3, 22"
        },
    },
    yellow: {
        "yellow-100": {
            contrast: "black",
            hex: "#fff9eb",
            oklch: "oklch(0.981 0.044 127.4)",
            rgb: "255, 249, 235"
        },
        "yellow-200": {
            contrast: "black",
            hex: "#fceaca",
            oklch: "oklch(0.942 0.077 109.9)",
            rgb: "252, 234, 202"
        },
        "yellow-300": {
            contrast: "black",
            hex: "#f8d4a5",
            oklch: "oklch(0.888 0.111 99.3)",
            rgb: "248, 212, 165"
        },
        "yellow-400": {
            contrast: "black",
            hex: "#f2be88",
            oklch: "oklch(0.835 0.134 92.6)",
            rgb: "242, 190, 136"
        },
        "yellow-500": {
            contrast: "white",
            hex: "#de7921",
            oklch: "oklch(0.676 0.231 84.8)",
            rgb: "222, 121, 33"
        },
        "yellow-600": {
            contrast: "white",
            hex: "#be501e",
            oklch: "oklch(0.567 0.201 73.7)",
            rgb: "190, 80, 30"
        },
        "yellow-700": {
            contrast: "white",
            hex: "#93320b",
            oklch: "oklch(0.454 0.180 72.3)",
            rgb: "147, 50, 11"
        },
        "yellow-800": {
            contrast: "white",
            hex: "#5f1b02",
            oklch: "oklch(0.329 0.137 72.8)",
            rgb: "95, 27, 2"
        },
    },
    white: {
        "white-100": {
            contrast: "black",
            hex: "#ffffff0D",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.05"
        },
        "white-200": {
            contrast: "black",
            hex: "#ffffff1A",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.1"
        },
        "white-300": {
            contrast: "black",
            hex: "#ffffff33",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.2"
        },
        "white-400": {
            contrast: "black",
            hex: "#ffffff66",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.4"
        },
        "white-500": {
            contrast: "black",
            hex: "#ffffff80",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.5"
        },
        "white-600": {
            contrast: "black",
            hex: "#ffffff99",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.6"
        },
        "white-700": {
            contrast: "black",
            hex: "#ffffffCC",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 0.8"
        },
        "white-800": {
            contrast: "black",
            hex: "#ffffffff",
            oklch: "oklch(0.998 0.026 160.7)",
            rgb: "255, 255, 255, 1.0"
        }
    }
};

export default function Page() {
    return (
        <div style={{ color: "#26251e", display: "flex", flexDirection: "column", fontFamily: "var(--font-dm-sans)", gap: "40px", padding: "16px" }}>
            <div style={{ backgroundColor: "#f2f1ed", borderRadius: "24px", padding: "48px" }}>
                <h1 style={{ fontSize: "80px", fontWeight: 500 }}>Color styles</h1>
                <p style={{ fontSize: "24px", padding: "0 8px" }}>Comprehensive color system for designing beautiful, accessible websites and apps.</p>
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
                                        navigator.clipboard.writeText(colorData.hex);
                                        toast.success(`Copied ${colorData.hex}`);
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.outline = "2px solid #26251e";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.outline = "none";
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
        </div>
    );
}