"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AdvancedOptionsSectionProps {
    children: React.ReactNode;
    defaultOpen?: boolean;
    title?: string;
}

export function AdvancedOptionsSection({ 
    children, 
    defaultOpen = false,
    title = "Advanced options"
}: AdvancedOptionsSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <>
            <Separator />
            <div className="items-center flex gap-2 justify-between">
                <div className="flex gap-2 text-sm">
                    <span className="font-medium">{title}</span>
                    <span className="text-neutral-600">Optional</span>
                </div>
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="icon-sm"
                    variant="ghost"
                >
                    {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Button>
            </div>
            {isOpen && children}
        </>
    );
}
