
import React, { useState } from 'react';
import { Property, DailyClick, Lead, Conversion, ClickData, DailyEarning, Achievement, DashboardWidgetId } from '../types';
import StatsCard from './StatsCard';
import TopPropertiesList from './TopPropertiesList';
import ClicksChart from './ClicksChart';
import LeadsList from './LeadsList';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { CursorArrowRaysIcon } from './icons/CursorArrowRaysIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { BadgeCheckIcon } from './icons/BadgeCheckIcon';
import { CashIcon } from './icons/CashIcon';
import ExportControl from './ExportControl';
import EarningsChart from './EarningsChart';
import AchievementsPanel from './AchievementsPanel';
import { SparklesIcon } from './icons/SparklesIcon';
import { useDashboardLayout } from '../hooks/useDashboardLayout';
import DashboardWidget from './DashboardWidget';
import { PencilIcon } from './icons/PencilIcon';
import GoalProgressWidget from './GoalProgressWidget';
import ConversionFunnelWidget from './ConversionFunnelWidget';


const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

interface DashboardProps {
  analytics: {
    totalClicks: number;
    topProperty: Property | null;
    clicksByProperty: Record<string, number>;
    dailyClickData: DailyClick[];
  };
  conversionAnalytics: {
    earningsByProperty: Record<string, number>;
    dailyEarningData: DailyEarning[];
  }
  funnelMetrics: {
    totalClicks: number;
    totalLeads: number;
    totalConversions: number;
    clickToLeadRate: number;
    leadToConversionRate: number;
    clickToConversionRate: number;
  };
  clicks: ClickData[];
  properties: Property[];
  leads: Lead[];
  isFavorite: (propertyId: string) => boolean;
  onComposeEmail: (lead: Lead) => void;
  conversions: Conversion[];
  onLogInvestment: (lead: Lead) => void;
  totalEarnings: number;
  achievements: Achievement[];
  onGetInsights: () => void;
  isGeneratingInsights: boolean;
  monthlyGoal: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    analytics, 
    conversionAnalytics, 
    funnelMetrics,
    clicks, 
    properties, 
    leads, 
    isFavorite, 
    onComposeEmail, 
    conversions, 
    onLogInvestment, 
    totalEarnings, 
    achievements,
    onGetInsights,
    isGeneratingInsights,
    monthlyGoal
}) => {
    const [isEditingLayout, setIsEditingLayout] = useState(false);
    const { layout, moveWidget, toggleWidgetVisibility } = useDashboardLayout();
    
    const { totalClicks, topProperty, clicksByProperty, dailyClickData } = analytics;
    const { earningsByProperty, dailyEarningData } = conversionAnalytics;
    const totalLeads = leads.length;
    const totalConversions = conversions.length;

    const noData = totalClicks === 0 && totalLeads === 0 && totalConversions === 0;

    const widgetMap: Record<DashboardWidgetId, { title: string, component: React.ReactNode }> = {
        goal_progress: { title: 'Goal Progress', component: <GoalProgressWidget currentEarnings={totalEarnings} goal={monthlyGoal} /> },
        conversion_funnel: { title: 'Conversion Funnel', component: <ConversionFunnelWidget metrics={funnelMetrics} />},
        clicks_chart: { title: 'Recent Activity', component: <ClicksChart data={dailyClickData} /> },
        earnings_chart: { title: 'Recent Earnings', component: <EarningsChart data={dailyEarningData} /> },
        leads_list: { title: 'Captured Leads', component: <LeadsList leads={leads} conversions={conversions} onComposeEmail={onComposeEmail} onLogInvestment={onLogInvestment} /> },
        top_properties: { title: 'Top Properties', component: <TopPropertiesList clicksByProperty={clicksByProperty} earningsByProperty={earningsByProperty} properties={properties} isFavorite={isFavorite} /> },
        achievements: { title: 'Achievements', component: <AchievementsPanel achievements={achievements} /> },
    };

    const wideWidgetIds: DashboardWidgetId[] = ['goal_progress', 'clicks_chart', 'earnings_chart', 'leads_list'];
    const narrowWidgetIds: DashboardWidgetId[] = ['conversion_funnel', 'top_properties', 'achievements'];

    const wideWidgets = layout.filter(w => wideWidgetIds.includes(w.id));
    const narrowWidgets = layout.filter(w => narrowWidgetIds.includes(w.id));

    if (noData && !isEditingLayout) {
        return (
            <div className="text-center py-24 bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                <ChartBarIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Your Dashboard is Ready</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">Click "Invest & Earn Bonus" on properties, capture leads, and log conversions to see your analytics here.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center gap-4 flex-wrap">
                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                 <div className="flex items-center gap-4">
                    <button
                        onClick={onGetInsights}
                        disabled={isGeneratingInsights}
                        className="inline-flex items-center justify-center gap-2 bg-cyan-500 text-gray-900 font-bold py-2.5 px-4 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105 disabled:bg-cyan-500/50 disabled:cursor-not-allowed"
                    >
                        <SparklesIcon className="w-5 h-5"/>
                        {isGeneratingInsights ? 'Analyzing...' : 'Get AI Insights'}
                    </button>
                    <ExportControl 
                        clicks={clicks}
                        leads={leads}
                        conversions={conversions}
                        properties={properties}
                    />
                    <button
                        onClick={() => setIsEditingLayout(!isEditingLayout)}
                        className={`inline-flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 ${isEditingLayout ? 'bg-cyan-500 text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        <PencilIcon className="w-5 h-5"/>
                        {isEditingLayout ? 'Done Editing' : 'Edit Layout'}
                    </button>
                 </div>
            </div>
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard title="Total Link Clicks" value={totalClicks.toString()} icon={CursorArrowRaysIcon} />
                <StatsCard title="Total Leads" value={totalLeads.toString()} icon={UserGroupIcon} />
                <StatsCard title="Total Conversions" value={totalConversions.toString()} icon={BadgeCheckIcon} />
                <StatsCard title="Total Earnings" value={formatCurrency(totalEarnings)} icon={CashIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    {wideWidgets.map((widgetConfig, index, arr) => {
                        const widget = widgetMap[widgetConfig.id];
                        if (!widget || (!widgetConfig.isVisible && !isEditingLayout)) return null;
                        return (
                           <DashboardWidget
                                key={widgetConfig.id}
                                id={widgetConfig.id}
                                title={widget.title}
                                isEditing={isEditingLayout}
                                isVisible={widgetConfig.isVisible}
                                onMove={moveWidget}
                                onToggleVisibility={toggleWidgetVisibility}
                                isFirst={index === 0}
                                isLast={index === arr.length - 1}
                            >
                                {widget.component}
                            </DashboardWidget>
                        );
                    })}
                </div>
                
                <div className="lg:col-span-1 space-y-8">
                    {narrowWidgets.map((widgetConfig, index, arr) => {
                        const widget = widgetMap[widgetConfig.id];
                        if (!widget || (!widgetConfig.isVisible && !isEditingLayout)) return null;
                        return (
                           <DashboardWidget
                                key={widgetConfig.id}
                                id={widgetConfig.id}
                                title={widget.title}
                                isEditing={isEditingLayout}
                                isVisible={widgetConfig.isVisible}
                                onMove={moveWidget}
                                onToggleVisibility={toggleWidgetVisibility}
                                isFirst={index === 0}
                                isLast={index === arr.length - 1}
                            >
                                {widget.component}
                            </DashboardWidget>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;