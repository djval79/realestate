
export type PropertyType = 'Apartment' | 'Villa';

export interface Property {
  id: string;
  name: string;
  location: string;
  roi: number;
  minInvestment: number;
  imageUrl: string;
  riskScore: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
}

export interface Message {
  author: 'user' | 'ai';
  text: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface PropertyAnalysisReport {
    summary: string;
    marketSnapshot: string;
    riskBreakdown: string;
    growthPotential: string;
}

export interface ClickData {
  propertyId: string;
  timestamp: number;
}

export interface DailyClick {
    date: string;
    count: number;
}

export type Theme = 'light' | 'dark' | 'system';

export interface Lead {
  email: string;
  timestamp: number;
}

export interface AIEmail {
  subject: string;
  body: string;
}

export interface Conversion {
  leadEmail: string;
  propertyId: string;
  investmentAmount: number;
  timestamp: number;
}

export interface DailyEarning {
    date: string;
    amount: number;
}

export type AchievementId = 'code_commander' | 'property_curator' | 'click_magnet' | 'lead_leader' | 'conversion_king' | 'high_roller';

export interface Achievement {
    id: AchievementId;
    name: string;
    description: string;
    unlocked: boolean;
}

export interface SavedContent {
  id: string;
  property: Property;
  text: string;
  imageUrl: string;
  savedAt: number;
}

export interface AIInsightsReport {
    performanceSummary: string;
    keyStrengths: string[];
    opportunitiesForGrowth: string[];
    actionableTips: string[];
}

export type DashboardWidgetId = 'top_properties' | 'achievements' | 'clicks_chart' | 'earnings_chart' | 'leads_list' | 'goal_progress' | 'conversion_funnel';

export interface DashboardLayout {
    id: DashboardWidgetId;
    isVisible: boolean;
}

export type ProactiveTipActionType = 'compose_email' | 'generate_content' | 'navigate';

export interface ProactiveTip {
    id: string;
    message: string;
    action: {
        type: ProactiveTipActionType;
        label: string;
        payload: any;
    };
}

export interface AITipSuggestion {
    id: string;
    shouldShow: boolean;
    message: string;
    actionLabel: string;
    actionType: ProactiveTipActionType | 'none';
    actionPayloadId?: string;
}


export type ChangeLogType = 'new' | 'improvement' | 'fix';

export interface ChangeLogItem {
    version: string;
    type: ChangeLogType;
    title: string;
    description: string;
}

export interface AIStrategicPlan {
    week1: { title: string; actions: string[] };
    week2: { title: string; actions: string[] };
    week3: { title: string; actions: string[] };
    week4: { title: string; actions: string[] };
}

export type Language = 'en' | 'es';
