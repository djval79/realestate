
import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'realisteFavorites';

const getStoredFavorites = (): string[] => {
    try {
        const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            return parsed.filter(item => typeof item === 'string');
        }
    } catch (error) {
        console.error("Failed to parse favorites from localStorage", error);
    }
    return [];
};

const setStoredFavorites = (favorites: string[]) => {
    try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error("Failed to save favorites to localStorage", error);
    }
};

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        setFavorites(getStoredFavorites());
    }, []);

    const toggleFavorite = useCallback((propertyId: string) => {
        setFavorites(prevFavorites => {
            const newFavorites = prevFavorites.includes(propertyId)
                ? prevFavorites.filter(id => id !== propertyId)
                : [...prevFavorites, propertyId];
            setStoredFavorites(newFavorites);
            return newFavorites;
        });
    }, []);

    const isFavorite = useCallback((propertyId: string) => {
        return favorites.includes(propertyId);
    }, [favorites]);
    
    const clearFavorites = useCallback(() => {
        setFavorites([]);
        localStorage.removeItem(FAVORITES_STORAGE_KEY);
    }, []);

    return { favorites, isFavorite, toggleFavorite, clearFavorites };
};