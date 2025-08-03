
import { useState, useEffect, useCallback } from 'react';

const GOAL_STORAGE_KEY = 'realisteEarningsGoal';

const getStoredGoal = (): number => {
    try {
        const stored = localStorage.getItem(GOAL_STORAGE_KEY);
        if (stored) {
            const parsed = parseFloat(stored);
            return isNaN(parsed) ? 0 : parsed;
        }
    } catch (error) {
        console.error("Failed to parse goal from localStorage", error);
    }
    return 0;
};

const setStoredGoal = (goal: number) => {
    try {
        localStorage.setItem(GOAL_STORAGE_KEY, goal.toString());
    } catch (error) {
        console.error("Failed to save goal to localStorage", error);
    }
};

export const useGoal = () => {
    const [monthlyGoal, setMonthlyGoal] = useState<number>(0);

    useEffect(() => {
        setMonthlyGoal(getStoredGoal());
    }, []);

    const setGoal = useCallback((goal: number) => {
        const newGoal = Math.max(0, goal);
        setMonthlyGoal(newGoal);
        setStoredGoal(newGoal);
    }, []);

    return { monthlyGoal, setGoal };
};
