import { useState, useEffect, useCallback } from 'react';
import { CallBackProps, STATUS } from 'react-joyride';

const TOUR_STORAGE_KEY = 'realisteTourCompleted_v1';

export const useTour = () => {
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        try {
            const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
            if (tourCompleted !== 'true') {
                // Timeout to allow the rest of the app to render and targets to be available
                setTimeout(() => setRun(true), 1500);
            }
        } catch (error) {
            console.error("Could not access localStorage for tour state.", error);
            setTimeout(() => setRun(true), 1500);
        }
    }, []);

    const handleJoyrideCallback = useCallback((data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            try {
                localStorage.setItem(TOUR_STORAGE_KEY, 'true');
                setRun(false);
            } catch (error) {
                 console.error("Could not save tour state to localStorage.", error);
            }
        }
    }, []);

    return { run, stepIndex, handleJoyrideCallback };
};
