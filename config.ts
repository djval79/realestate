
import { ChangeLogItem } from './types';

export const APP_VERSION = "1.1.0";

export const getChangelog = (t: (key: string) => string): ChangeLogItem[] => [
    {
        version: "1.1.0",
        type: "new",
        title: t('changelog.v1_1_0.proactiveAssistant.title'),
        description: t('changelog.v1_1_0.proactiveAssistant.description')
    },
    {
        version: "1.1.0",
        type: "new",
        title: t('changelog.v1_1_0.customDashboard.title'),
        description: t('changelog.v1_1_0.customDashboard.description')
    },
    {
        version: "1.1.0",
        type: "improvement",
        title: t('changelog.v1_1_0.pwa.title'),
        description: t('changelog.v1_1_0.pwa.description')
    },
];
