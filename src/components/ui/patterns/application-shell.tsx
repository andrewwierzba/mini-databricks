"use client";

import { useState } from "react";

import { Toaster } from "sonner";

import { Assistant } from "@/components/ui/patterns/assistant";
import { Navigation } from "@/components/ui/patterns/navigation";
import { Navigation as SideNavigation } from "@/components/ui/patterns/side-navigation";

export interface NavigationItem {
    href: string;
    icon: React.ReactNode;
    name: string;
}

export interface NavigationGroup {
    items: NavigationItem[];
    name?: string;
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
				<div className="bg-white border-gray-200 border flex flex-1 font-sans overflow-hidden rounded-sm">
					<div aria-label="application-content" className="flex-1 overflow-hidden">
						{children}
					</div>
				</div>

				{/* AI Assistant Panel */}
				{showAssistant && (
					<Assistant
						onClose={() => onToggleAssistant?.(false)}
						responses={[
							{
								content:
									"This run failed because the source table vendor_sales_data was empty for partition 2026-01-29. The upstream job vendor_ingest_pipeline did not complete. I recommend waiting for upstream data and re-running, or setting up an alert for upstream completion.",
							},
							{
								content:
									"You can add a dependency condition so this job only runs after vendor_ingest_pipeline succeeds for the same partition. I can suggest the exact trigger configuration if you’d like.",
							},
						]}
					/>
				)}
			</div>

            {/* Application Notifications */}
            <Toaster />
		</div>
    );
};
