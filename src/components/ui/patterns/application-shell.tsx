"use client";

import { useState } from "react";

import { Toaster } from "sonner";

import { StoreIcon } from "lucide-react"

import { CatalogIcon, ClockIcon, CloudIcon, GridIcon, NotebookIcon, WorkflowsIcon, WorkspacesIcon } from "@databricks/design-system"

import { Assistant } from "@/components/ui/patterns/assistant";
import { Navigation } from "@/components/ui/patterns/navigation";
import { Navigation as SideNavigation } from "@/components/ui/patterns/side-navigation";

interface NavigationItem {
    href: string;
    icon: React.ReactNode;
    name: string;
}

interface ApplicationShellProps {
    children: React.ReactNode;
    navigationItems?: NavigationItem[];
}

export function ApplicationShell({
    children,
    navigationItems,
}: ApplicationShellProps) {
    const [showAssistant, setShowAssistant] = useState(false)
    const [showSideNavigation, setShowSideNavigation] = useState(true)

    return (
        <div className="flex flex-1 flex-col h-full p-2">
            {/* Application Header */}
			<Navigation 
                isAssistantOpen={showAssistant}
                onToggleAssistant={() => setShowAssistant(!showAssistant)}
                onToggleSideNavigation={() => setShowSideNavigation(!showSideNavigation)}
            />
            
			<div className="flex flex-1 h-full">
				{/* Application Navigation */}
				{showSideNavigation && <SideNavigation navigationItems={navigationItems} onClose={() => setShowSideNavigation(false)} />}
				
				{/* Application Content */}
				<div className="bg-(--du-bois-color-background-primary) border-(--du-bois-color-border) border rounded-sm flex flex-1 font-sans h-full">
					<div className="flex-1">
						{children}
					</div>
					{showAssistant && <Assistant onClose={() => setShowAssistant(false)} />}
				</div>
			</div>

            {/* Application Notifications */}
            <Toaster />
		</div>
    )
}