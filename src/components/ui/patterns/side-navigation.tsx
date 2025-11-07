"use client";

import { StoreIcon } from "lucide-react";

import { CatalogIcon, ClockIcon, CloudIcon, GridIcon, NotebookIcon, WorkflowsIcon } from "@databricks/design-system";

import { Button } from "@/components/ui/button";

interface NavigationItem {
    href: string;
    icon: React.ReactNode;
    name: string;
}

const defaultNavigationItems: NavigationItem[] = [{
    href: "/workspace",
    icon: <NotebookIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    name: "Workspace"
}, {
    href: "/recents",
    icon: <ClockIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    name: "Recents"
}, {
    href: "/catalog",
    icon: <CatalogIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    name: "Catalog"
}, {
    href: "/jobs-and-pipelines",
    icon: <WorkflowsIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    name: "Jobs & Pipelines"
}, {
    href: "/Compute",
    icon: <CloudIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    name: "Compute"
}, {
    href: "/discover",
    icon: <GridIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    name: "Discover"
}, {
    href: "/marketplace",
    icon: <StoreIcon />,
    name: "Marketplace"
}];

interface NavigationProps {
    defaultWidth?: string;
    minWidth?: string;
    navigationItems?: NavigationItem[];
    onClose: () => void;
}

export function Navigation({
    defaultWidth = "200px",
    minWidth = "200px",
    navigationItems = defaultNavigationItems,
}: NavigationProps) {
    return (
        <nav
            aria-label="navigation"
            className="flex flex-col gap-2 h-full px-2"
            style={{
                minWidth: minWidth,
                width: defaultWidth
            }}
        >
            {navigationItems.map((item) => (
                <Button
                    aria-label={item.name}
                    className="rounded-sm justify-start"
                    size="sm"
                    variant="ghost"
                >
                    <span style={{ color: "var(--du-bois-text-secondary)" }}>
                        {item.icon}
                    </span>
                    {item.name}
                </Button>
            ))}
        </nav>
    )
}