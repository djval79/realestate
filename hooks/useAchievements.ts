
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Achievement, AchievementId, ClickData, Conversion, Lead } from '../types';
import { useToast } from './useToast';

const ACHIEVEMENTS_STORAGE_KEY = 'realisteAchievementsSeen';

const ALL_ACHIEVEMENT_IDS: AchievementId[] = [
    'code_commander', 'property_curator', 'click_magnet', 'lead_leader', 'conversion_king', 'high_roller'
];

const getSeenAchievements = (): Set<AchievementId> => {
    try {
        const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
        if (stored) {
            return new Set(JSON.parse(stored));
        }
    } catch (e) {
        console.error("Failed to parse seen achievements", e);
    }
    return new Set();
};

const setSeenAchievementsStore = (seen: Set<AchievementId>) => {
    try {
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(Array.from(seen)));
    } catch (e) {
        console.error("Failed to save seen achievements", e);
    }
};

interface AchievementsProps {
    referralCode: string;
    favorites: string[];
    clicks: ClickData[];
    leads: Lead[];
    conversions: Conversion[];
    totalEarnings: number;
}

export const useAchievements = ({
    referralCode,
    favorites,
    clicks,
    leads,
    conversions,
    totalEarnings
}: AchievementsProps, t: (key: string, options?: { [key: string]: string | number }) => string) => {
    const { addToast } = useToast();
    const [seenAchievements, setSeenAchievements] = useState<Set<AchievementId>>(getSeenAchievements());

    const achievements = useMemo<Achievement[]>(() => {
        return ALL_ACHIEVEMENT_IDS.map(id => {
            let unlocked = false;
            switch (id) {
                case 'code_commander':
                    unlocked = !!referralCode;
                    break;
                case 'property_curator':
                    unlocked = favorites.length > 0;
                    break;
                case 'click_magnet':
                    unlocked = clicks.length >= 10;
                    break;
                case 'lead_leader':
                    unlocked = leads.length > 0;
                    break;
                case 'conversion_king':
                    unlocked = conversions.length > 0;
                    break;
                case 'high_roller':
                    unlocked = totalEarnings >= 100;
                    break;
            }
            return { 
                id, 
                name: t(`achievements.list.${id}.name`),
                description: t(`achievements.list.${id}.description`),
                unlocked 
            };
        });
    }, [referralCode, favorites.length, clicks.length, leads.length, conversions.length, totalEarnings, t]);

    useEffect(() => {
        const newlyUnlocked = achievements.filter(a => a.unlocked && !seenAchievements.has(a.id));
        
        if (newlyUnlocked.length > 0) {
            const newSeen = new Set(seenAchievements);
            newlyUnlocked.forEach(ach => {
                addToast(t('toasts.achievementUnlocked', { name: ach.name }), 'success');
                newSeen.add(ach.id);
            });
            setSeenAchievements(newSeen);
            setSeenAchievementsStore(newSeen);
        }
    }, [achievements, seenAchievements, addToast, t]);

    const clearSeenAchievements = useCallback(() => {
        setSeenAchievements(new Set());
        localStorage.removeItem(ACHIEVEMENTS_STORAGE_KEY);
    }, []);

    return { achievements, clearSeenAchievements };
};
