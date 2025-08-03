
import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout, DashboardWidgetId } from '../types';

const LAYOUT_STORAGE_KEY = 'realisteDashboardLayout_v4';

const DEFAULT_LAYOUT: DashboardLayout[] = [
    { id: 'goal_progress', isVisible: true },
    { id: 'conversion_funnel', isVisible: true },
    { id: 'top_properties', isVisible: true },
    { id: 'achievements', isVisible: true },
    { id: 'clicks_chart', isVisible: true },
    { id: 'earnings_chart', isVisible: true },
    { id: 'leads_list', isVisible: true },
];

const getStoredLayout = (): DashboardLayout[] => {
    try {
        const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored) as DashboardLayout[];
            // Ensure all default widgets are present, even if new ones were added
            const allWidgetIds = new Set(parsed.map(w => w.id));
            const missingWidgets = DEFAULT_LAYOUT.filter(w => !allWidgetIds.has(w.id));
            if (missingWidgets.length > 0) {
                const updatedLayout = [...parsed, ...missingWidgets];
                setStoredLayout(updatedLayout);
                return updatedLayout;
            }
            return parsed;
        }
    } catch (error) {
        console.error("Failed to parse dashboard layout from localStorage", error);
    }
    return DEFAULT_LAYOUT;
};

const setStoredLayout = (layout: DashboardLayout[]) => {
    try {
        localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
    } catch (error) {
        console.error("Failed to save dashboard layout to localStorage", error);
    }
};

export const useDashboardLayout = () => {
    const [layout, setLayout] = useState<DashboardLayout[]>([]);

    useEffect(() => {
        setLayout(getStoredLayout());
    }, []);

    const saveLayout = (newLayout: DashboardLayout[]) => {
        setLayout(newLayout);
        setStoredLayout(newLayout);
    };

    const toggleWidgetVisibility = useCallback((id: DashboardWidgetId) => {
        const newLayout = layout.map(widget => 
            widget.id === id ? { ...widget, isVisible: !widget.isVisible } : widget
        );
        saveLayout(newLayout);
    }, [layout]);

    const moveWidget = useCallback((id: DashboardWidgetId, direction: 'up' | 'down') => {
        const index = layout.findIndex(widget => widget.id === id);
        if (index === -1) return;

        const newLayout = [...layout];
        const to = direction === 'up' ? index - 1 : index + 1;

        if (to >= 0 && to < newLayout.length) {
            const [item] = newLayout.splice(index, 1);
            newLayout.splice(to, 0, item);
            saveLayout(newLayout);
        }
    }, [layout]);

    return { layout, moveWidget, toggleWidgetVisibility };
};