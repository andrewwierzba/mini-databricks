import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Bug, ChevronDown, List, MessageCircle, Sparkle } from "lucide-react";

type Mode = "agent" | "ask" | "debug" | "plan";

const DEFAULT_ORDER: Mode[] = ["agent", "ask", "debug", "plan"];

const MODE_CONFIG: Record<Mode, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
    agent: { icon: Sparkle, label: "Agent" },
    ask: { icon: MessageCircle, label: "Ask" },
    debug: { icon: Bug, label: "Debug" },
    plan: { icon: List, label: "Plan" },
};

interface ModesProps {
    itemOrder?: Mode[];
}

export function Modes({ itemOrder = DEFAULT_ORDER }: ModesProps) {
    const [mode, setMode] = useState<Mode>("agent");
    const order = itemOrder.filter((m) => m in MODE_CONFIG) as Mode[];

    return (
        <div aria-label="modes">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {order.map((m) => {
                        const { icon: Icon, label } = MODE_CONFIG[m];
                        return (
                            <DropdownMenuItem key={m} onClick={() => setMode(m)}>
                                <Icon className="h-4 w-4" />
                                {label}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
