"use client";

import * as React from "react";

import { 
    Tabs as BaseTabs, 
    TabsList as BaseTabsList, 
    TabsTrigger as BaseTabsTrigger, 
    TabsContent as BaseTabsContent 
} from "@/components/ui/tabs"

import { cn } from "@/lib/utils";

import "@/app/styles/styles.css";

type TabsProps = React.ComponentProps<typeof BaseTabs>;

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, ...props }, ref) => {
        return (
            <BaseTabs
                ref={ref}
                className={cn(className)}
                {...props}
            />
        )
    }
);

Tabs.displayName = "Tabs";

type TabsListProps = React.ComponentProps<typeof BaseTabsList>;

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, ...props }, ref) => {
        return (
            <BaseTabsList
                ref={ref}
                className={cn(
                    "bg-transparent border-b border-(--gray-100) rounded-none justify-start p-0",
                    className
                )}
                {...props}
            />
        )
    }
);

TabsList.displayName = "TabsList";

type TabsTriggerProps = React.ComponentProps<typeof BaseTabsTrigger>;

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, ...props }, ref) => {
        return (
            <BaseTabsTrigger
                ref={ref}
                className={cn(
                    "bg-transparent border-0 border-b-[3px] border-transparent rounded-none text-(--gray-600) flex-none font-bold w-auto data-[state=active]:text-[var(--black-800)] data-[state=active]:border-b-[var(--blue-600)] data-[state=active]:shadow-none data-[state=active]:text-(--black-800)",
                    className
                )}
                {...props}
            />
        )
    }
);

TabsTrigger.displayName = "TabsTrigger";

type TabsContentProps = React.ComponentProps<typeof BaseTabsContent>;

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, ...props }, ref) => {
        return (
            <BaseTabsContent
                ref={ref}
                className={cn(className)}
                {...props}
            />
        )
    }
);

TabsContent.displayName = "TabsContent";

export { 
    Tabs, 
    TabsList, 
    TabsTrigger, 
    TabsContent,
    type TabsProps,
    type TabsListProps,
    type TabsTriggerProps,
    type TabsContentProps
};
