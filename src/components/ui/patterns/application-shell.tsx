"use client";

import { useState } from "react";

import { Toaster } from "sonner";


import { Assistant } from "@/components/ui/patterns/assistant";
import { Navigation } from "@/components/ui/patterns/navigation";
import { Navigation as SideNavigation } from "@/components/ui/patterns/side-navigation";

interface NavigationItem {
    href: string;
    icon: React.ReactNode;
    name: string;
};

interface ApplicationShellProps {
    children: React.ReactNode;
    navigationItems?: NavigationItem[];
};

export function ApplicationShell({
    children,
    navigationItems,
}: ApplicationShellProps) {
    const [showAssistant, setShowAssistant] = useState(false);
    const [showSideNavigation, setShowSideNavigation] = useState(false);

    return (
        <div className="flex flex-1 flex-col h-full p-2">
            {/* Application Header */}
			<Navigation 
                isAssistantOpen={showAssistant}
                onToggleAssistant={() => setShowAssistant(!showAssistant)}
                onToggleSideNavigation={() => setShowSideNavigation(!showSideNavigation)}
            />
            
			<div className="flex flex-1 overflow-hidden">
				{/* Application Navigation */}
				{showSideNavigation && <SideNavigation navigationItems={navigationItems} onClose={() => setShowSideNavigation(false)} />}
				
                {/* Application Content */}
                <div className="bg-(--white-800) border-(--gray-100) border rounded-sm flex flex-1 font-sans overflow-hidden">
                    <div aria-label="application-content" className="flex-1 overflow-hidden">
                        {children}
                    </div>
                    {showAssistant && <Assistant onClose={() => setShowAssistant(false)} />}
                </div>
			</div>

            {/* Application Notifications */}
            <Toaster />
		</div>
    );
};
