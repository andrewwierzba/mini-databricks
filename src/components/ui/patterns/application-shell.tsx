"use client";

import { useState } from "react";

import { Toaster } from "sonner";

import { Navigation } from "@/components/ui/patterns/navigation";
import { Navigation as SideNavigation } from "@/components/ui/patterns/side-navigation";

interface NavigationGroup {
    items: NavigationItem[];
    name?: string;
}

interface NavigationItem {
    href: string;
    icon: React.ReactNode;
    name: string;
}

interface ApplicationShellProps {
    children: React.ReactNode;
    navigationItems?: NavigationGroup[];
    showAssistant?: boolean;
    onApplyChanges?: () => void;
    onRevertChanges?: () => void;
    onToggleAssistant?: (show: boolean) => void;
}

export function ApplicationShell({
    children,
    navigationItems,
    onToggleAssistant,
    showAssistant = false,
}: ApplicationShellProps) {
    const [showSideNavigation, setShowSideNavigation] = useState(false);

    const handleToggleAssistant = () => {
        onToggleAssistant?.(!showAssistant);
    };

    return (
        <div className="flex flex-1 flex-col h-full p-2">
            {/* Application Header */}
			<Navigation 
                isAssistantOpen={showAssistant}
                onToggleAssistant={handleToggleAssistant}
                onToggleSideNavigation={() => setShowSideNavigation(!showSideNavigation)}
            />
            
			<div className="flex flex-1 overflow-hidden">
				{/* Application Navigation */}
				{showSideNavigation && <SideNavigation navigationItems={navigationItems} onClose={() => setShowSideNavigation(false)} />}
				
                {/* Application Content */}
                <div className="bg-white border-gray-200 border rounded-sm flex flex-1 font-sans overflow-hidden">
                    <div aria-label="application-content" className="flex-1 overflow-hidden">
                        {children}
                    </div>
                </div>
			</div>

            {/* Application Notifications */}
            <Toaster />
		</div>
    );
};
