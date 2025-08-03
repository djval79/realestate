
import { useState, useEffect, useCallback } from 'react';
import { APP_VERSION, getChangelog } from '../config';
import { ChangeLogItem } from '../types';

const LAST_SEEN_VERSION_KEY = 'realisteLastSeenVersion';

export const useWhatsNew = (t: (key: string) => string) => {
    const [showModal, setShowModal] = useState(false);
    const [changelogItems, setChangelogItems] = useState<ChangeLogItem[]>([]);

    useEffect(() => {
        try {
            const lastSeenVersion = localStorage.getItem(LAST_SEEN_VERSION_KEY);

            if (lastSeenVersion !== APP_VERSION) {
                const changelog = getChangelog(t);
                const currentVersionChanges = changelog.filter(
                    item => item.version === APP_VERSION
                );

                if (currentVersionChanges.length > 0) {
                    setChangelogItems(currentVersionChanges);
                    setTimeout(() => setShowModal(true), 1000);
                }
            }
        } catch (error) {
            console.error("Could not access localStorage for What's New feature.", error);
        }
    }, [t]);

    const closeWhatsNew = useCallback(() => {
        setShowModal(false);
        try {
            localStorage.setItem(LAST_SEEN_VERSION_KEY, APP_VERSION);
        } catch (error) {
            console.error("Could not save last seen version to localStorage.", error);
        }
    }, []);

    return {
        showWhatsNew: showModal,
        whatsNewLog: changelogItems,
        closeWhatsNew
    };
};
