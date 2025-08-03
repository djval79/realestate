
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ClickData, Property, DailyClick } from '../types';

const ANALYTICS_KEY = 'realisteAnalyticsData';

const getStoredClicks = (): ClickData[] => {
    try {
        const storedData = localStorage.getItem(ANALYTICS_KEY);
        if (!storedData) return [];
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed)) {
            // Basic validation
            return parsed.filter(item => typeof item.propertyId === 'string' && typeof item.timestamp === 'number');
        }
    } catch (error) {
        console.error("Failed to parse analytics data from localStorage", error);
    }
    return [];
};

const setStoredClicks = (clicks: ClickData[]) => {
    try {
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(clicks));
    } catch (error) {
        console.error("Failed to save analytics data to localStorage", error);
    }
};

export const useAnalytics = (properties: Property[]) => {
    const [clicks, setClicks] = useState<ClickData[]>([]);

    useEffect(() => {
        setClicks(getStoredClicks());
    }, []);

    const logClick = (propertyId: string) => {
        const newClick: ClickData = { propertyId, timestamp: Date.now() };
        const updatedClicks = [...clicks, newClick];
        setClicks(updatedClicks);
        setStoredClicks(updatedClicks);
    };

    const clearClicks = useCallback(() => {
        setClicks([]);
        localStorage.removeItem(ANALYTICS_KEY);
    }, []);

    const analytics = useMemo(() => {
        const totalClicks = clicks.length;

        const clicksByProperty = clicks.reduce((acc, click) => {
            acc[click.propertyId] = (acc[click.propertyId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topPropertyId = Object.keys(clicksByProperty).sort((a, b) => clicksByProperty[b] - clicksByProperty[a])[0];
        const topProperty = properties.find(p => p.id === topPropertyId) || null;
        
        const clicksLast7Days = clicks.filter(click => {
            const daysAgo = (Date.now() - click.timestamp) / (1000 * 60 * 60 * 24);
            return daysAgo <= 7;
        });

        const dailyClicksMap = clicksLast7Days.reduce((acc, click) => {
            const date = new Date(click.timestamp).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const dailyClickData: DailyClick[] = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            return {
                date: dateStr,
                count: dailyClicksMap[dateStr] || 0,
            };
        }).reverse();
        
        return {
            totalClicks,
            topProperty,
            clicksByProperty,
            dailyClickData,
        };
    }, [clicks, properties]);

    return { analytics, clicks, logClick, clearClicks };
};