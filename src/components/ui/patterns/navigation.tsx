"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { AppIcon, MenuIcon, SearchIcon } from "@databricks/design-system"
import { Avatar } from "@databricks/design-system"

export const GradientSparkle = ({ height, isFilled = false, size = 16, width }: { height?: number; isFilled?: boolean; size?: number; width?: number }) => {
    return (
        <>
            {/* Gradient definition */}
            <svg height="0" width="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient
                        id="ai-gradient"
                        x1="0"
                        x2="1"
                        y1="0"
                        y2="1"
                    >
                        <stop offset="24%" stopColor="oklch(66.2% 0.135 246.5)" />
                        <stop offset="47%" stopColor="oklch(63.4% 0.245 321.7)" />
                        <stop offset="76%" stopColor="oklch(69.1% 0.199 31.4)" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Icon */}
            <svg height={height ?? size} width={width ?? size} viewBox="0 0 16 16">
                <path
                    className={`transition-all duration-200 group-hover:[fill-rule:nonzero] ${isFilled ? '[fill-rule:nonzero]' : ''}`}
                    clipRule="evenodd"
                    d="M10.726 8.813 13.199 8l-2.473-.813a3 3 0 0 1-1.913-1.913L8 2.801l-.813 2.473a3 3 0 0 1-1.913 1.913L2.801 8l2.473.813a3 3 0 0 1 1.913 1.913L8 13.199l.813-2.473a3 3 0 0 1 1.913-1.913m2.941.612c1.376-.452 1.376-2.398 0-2.85l-2.472-.813a1.5 1.5 0 0 1-.957-.956l-.813-2.473c-.452-1.376-2.398-1.376-2.85 0l-.813 2.473a1.5 1.5 0 0 1-.956.956l-2.473.813c-1.376.452-1.376 2.398 0 2.85l2.473.813a1.5 1.5 0 0 1 .956.957l.813 2.472c.452 1.376 2.398 1.376 2.85 0l.813-2.472a1.5 1.5 0 0 1 .957-.957z"
                    fill="url(#ai-gradient)"
                    fillRule="evenodd"
                />
            </svg>
        </>
    );
};

export function Navigation({ 
    isAssistantOpen = false,
    onToggleAssistant,
    onToggleSideNavigation, 
}: { 
    isAssistantOpen?: boolean;
    onToggleAssistant?: () => void;
    onToggleSideNavigation?: () => void;
}) {
    return (
        <nav aria-label="navigation" className="items-center flex gap-2 justify-between mb-2 px-2">
            {/* Navigation menu */}
            <div className="items-center flex gap-2">
                <Button
                    aria-label="navigation-menu"
                    className="rounded-sm"
                    onClick={onToggleSideNavigation}
                    size="icon"
                    variant="ghost"
                >
                    <MenuIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </Button>
                <div className="bg-white rounded-sm h-6 w-6" />
            </div>

            {/* Navigation search */}
            <div className="items-center flex max-w-[560px] relative w-full">
                <SearchIcon
                    className="bottom left-3 absolute top"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    style={{
                        color: 'var(--du-bois-text-secondary)'
                    }}
                />
                <Input
                    className="bg-background rounded-sm shadow-none text-[13px] pl-10"
                    placeholder="Search data, notebooks, recents, and more..."
                />
                <span className="bottom text-du-bois-text-secondary text-[13px] absolute right-3 z-10">⌘ + P</span>
            </div>

            {/* Navigation miscellaneous */}
            <div className="items-center flex gap-2">
                <div className="flex gap-1">
                    <Button
                        aria-label="global-assistant"
                        className="rounded-sm group transition-all"
                        onClick={onToggleAssistant}
                        size="icon"
                        variant="ghost"
                    >
                        <GradientSparkle isFilled={isAssistantOpen} />
                    </Button>
                    <Button
                        aria-label="app-switcher"
                        className="rounded-sm"
                        size="icon"
                        variant="ghost"
                    >
                        <AppIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </Button>
                </div>
                <Avatar
                    aria-label="profile"
                    label="Andrew"
                    size="sm"
                    type="user"
                />
            </div>
        </nav>
    )
}