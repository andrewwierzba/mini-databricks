"use client";

import { createContext, useCallback, useContext, useState } from "react";

import type { NavigationGroup } from "@/components/ui/patterns/application-shell";

interface NavigationItemsContextValue {
    navigationItems: NavigationGroup[];
    setNavigationItems: (items: NavigationGroup[]) => void;
}

const NavigationItemsContext = createContext<NavigationItemsContextValue | null>(null);

export function NavigationItemsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [navigationItems, setNavigationItems] = useState<NavigationGroup[]>([]);
    const setter = useCallback((items: NavigationGroup[]) => {
        setNavigationItems(items);
    }, []);
    return (
        <NavigationItemsContext.Provider
            value={{ navigationItems, setNavigationItems: setter }}
        >
            {children}
        </NavigationItemsContext.Provider>
    );
}

export function useNavigationItems() {
    const ctx = useContext(NavigationItemsContext);
    if (!ctx) return { navigationItems: [], setNavigationItems: () => {} };
    return ctx;
}
