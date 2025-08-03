
import { useState, useEffect, useCallback } from 'react';
import { SavedContent, Property } from '../types';
import { useToast } from './useToast';

const LIBRARY_STORAGE_KEY = 'realisteLibraryContent';

const getStoredContent = (): SavedContent[] => {
    try {
        const stored = localStorage.getItem(LIBRARY_STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            // Basic validation
            return parsed.filter(item => 
                item.id && item.property && item.text && item.imageUrl && item.savedAt
            );
        }
    } catch (error) {
        console.error("Failed to parse library content from localStorage", error);
    }
    return [];
};

const setStoredContent = (content: SavedContent[]) => {
    try {
        localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(content));
    } catch (error) {
        console.error("Failed to save library content to localStorage", error);
    }
};

export const useLibrary = () => {
    const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        setSavedContent(getStoredContent());
    }, []);

    const addContentToLibrary = useCallback((property: Property, text: string, imageUrl: string) => {
        if (!text.trim() || !imageUrl) {
            addToast("Cannot save empty content.", "error");
            return;
        }

        const newContent: SavedContent = {
            id: `lib_${Date.now()}`,
            property,
            text,
            imageUrl,
            savedAt: Date.now()
        };

        setSavedContent(prevContent => {
            const updatedContent = [newContent, ...prevContent];
            setStoredContent(updatedContent);
            return updatedContent;
        });
        addToast("Content saved to your library!", "success");
    }, [addToast]);
    
    const deleteContentFromLibrary = useCallback((id: string) => {
        setSavedContent(prevContent => {
            const updatedContent = prevContent.filter(item => item.id !== id);
            setStoredContent(updatedContent);
            return updatedContent;
        });
        addToast("Content removed from library.", "info");
    }, [addToast]);

    const clearLibrary = useCallback(() => {
        setSavedContent([]);
        localStorage.removeItem(LIBRARY_STORAGE_KEY);
    }, []);

    return { savedContent, addContentToLibrary, deleteContentFromLibrary, clearLibrary };
};