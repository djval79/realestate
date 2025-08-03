import React, { useMemo } from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';
import { useTheme } from '../hooks/useTheme';

interface AppTourProps {
    run: boolean;
    stepIndex: number;
    handleJoyrideCallback: (data: CallBackProps) => void;
}

const tourSteps: Step[] = [
    {
        target: '#referral-code-manager',
        content: 'Start here! Set your unique referral code to personalize all generated links and content.',
        disableBeacon: true,
        placement: 'bottom',
    },
    {
        target: '#earnings-calculator',
        content: 'Use this calculator to see your potential bonus based on the investment amount.',
        placement: 'bottom',
    },
    {
        target: '#generate-ai-post-tour-target',
        content: 'Click here to generate a complete social media post with a stunning image and hashtags, all powered by AI.',
        placement: 'top',
    },
    {
        target: '#dashboard-nav-button',
        content: 'Finally, track the performance of your shared links in the Dashboard view.',
        placement: 'bottom',
    }
];

const AppTour: React.FC<AppTourProps> = ({ run, stepIndex, handleJoyrideCallback }) => {
    const { appliedTheme } = useTheme();

    const tourStyles = useMemo(() => ({
        options: {
            arrowColor: appliedTheme === 'dark' ? '#1f2937' : '#fff',
            backgroundColor: appliedTheme === 'dark' ? '#1f2937' : '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.7)',
            primaryColor: '#06b6d4', // cyan-500
            textColor: appliedTheme === 'dark' ? '#f9fafb' : '#111827',
            zIndex: 10000,
        },
        spotlight: {
            borderRadius: '1rem',
        },
        buttonClose: {
            display: 'none',
        }
    }), [appliedTheme]);

    return (
        <Joyride
            steps={tourSteps}
            run={run}
            stepIndex={stepIndex}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={tourStyles}
        />
    );
};

export default React.memo(AppTour);