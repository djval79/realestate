
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Conversion, DailyEarning } from '../types';
import { useToast } from './useToast';

const CONVERSIONS_STORAGE_KEY = 'realisteConversions';

const getStoredConversions = (): Conversion[] => {
    try {
        const stored = localStorage.getItem(CONVERSIONS_STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            // simple validation
            return parsed.filter(item => 
                typeof item.leadEmail === 'string' && 
                typeof item.propertyId === 'string' &&
                typeof item.investmentAmount === 'number' &&
                typeof item.timestamp === 'number'
            );
        }
    } catch (error) {
        console.error("Failed to parse conversions data from localStorage", error);
    }
    return [];
};

const setStoredConversions = (conversions: Conversion[]) => {
    try {
        localStorage.setItem(CONVERSIONS_STORAGE_KEY, JSON.stringify(conversions));
    } catch (error) {
        console.error("Failed to save conversions data to localStorage", error);
    }
};

export const useConversions = () => {
    const [conversions, setConversions] = useState<Conversion[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        setConversions(getStoredConversions());
    }, []);

    const addConversion = useCallback((newConversionData: Omit<Conversion, 'timestamp'>) => {
        const newConversion: Conversion = { ...newConversionData, timestamp: Date.now() };
        
        setConversions(prevConversions => {
            // Prevent duplicate conversions for the same lead
            if (prevConversions.some(c => c.leadEmail === newConversion.leadEmail)) {
                addToast("This lead has already been marked as converted.", "error");
                return prevConversions;
            }
            const updatedConversions = [newConversion, ...prevConversions];
            setStoredConversions(updatedConversions);
            addToast("Investment successfully logged!", 'success');
            return updatedConversions;
        });
    }, [addToast]);
    
    const clearConversions = useCallback(() => {
        setConversions([]);
        localStorage.removeItem(CONVERSIONS_STORAGE_KEY);
    }, []);
    
    const conversionAnalytics = useMemo(() => {
        const earningsByProperty = conversions.reduce((acc, conv) => {
            const earnings = conv.investmentAmount * 0.015;
            acc[conv.propertyId] = (acc[conv.propertyId] || 0) + earnings;
            return acc;
        }, {} as Record<string, number>);

        const conversionsLast7Days = conversions.filter(conv => {
            const daysAgo = (Date.now() - conv.timestamp) / (1000 * 60 * 60 * 24);
            return daysAgo <= 7;
        });

        const dailyEarningsMap = conversionsLast7Days.reduce((acc, conv) => {
            const date = new Date(conv.timestamp).toISOString().split('T')[0];
            const earnings = conv.investmentAmount * 0.015;
            acc[date] = (acc[date] || 0) + earnings;
            return acc;
        }, {} as Record<string, number>);

        const dailyEarningData: DailyEarning[] = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            return {
                date: dateStr,
                amount: dailyEarningsMap[dateStr] || 0,
            };
        }).reverse();
        
        return {
            earningsByProperty,
            dailyEarningData,
        };
    }, [conversions]);

    return { conversions, addConversion, conversionAnalytics, clearConversions };
};