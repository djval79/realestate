
import { useState, useEffect, useCallback } from 'react';
import { Lead } from '../types';

const LEADS_STORAGE_KEY = 'realisteLeads';

const getStoredLeads = (): Lead[] => {
    try {
        const stored = localStorage.getItem(LEADS_STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            // simple validation
            return parsed.filter(item => typeof item.email === 'string' && typeof item.timestamp === 'number');
        }
    } catch (error) {
        console.error("Failed to parse leads data from localStorage", error);
    }
    return [];
};

const setStoredLeads = (leads: Lead[]) => {
    try {
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch (error) {
        console.error("Failed to save leads data to localStorage", error);
    }
};


export const useLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);

    useEffect(() => {
        setLeads(getStoredLeads());
    }, []);

    const addLead = (email: string) => {
        const newLead: Lead = { email, timestamp: Date.now() };
        const updatedLeads = [newLead, ...leads]; // Add new lead to the top
        setLeads(updatedLeads);
        setStoredLeads(updatedLeads);
    };
    
    const clearLeads = useCallback(() => {
        setLeads([]);
        localStorage.removeItem(LEADS_STORAGE_KEY);
    }, []);

    return { leads, addLead, clearLeads };
};