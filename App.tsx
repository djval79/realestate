
import React, { useState, useMemo, useEffect } from 'react';
import { Property, Lead, PropertyType, Conversion, ClickData, Achievement, SavedContent, AIInsightsReport, ProactiveTip, AIStrategicPlan } from './types';
import { MOCK_PROPERTIES } from './data/properties';
import { ToastProvider } from './hooks/useToast';
import Header from './components/Header';
import PropertyCard from './components/PropertyCard';
import PropertyCardSkeleton from './components/PropertyCardSkeleton';
import Calculator from './components/Calculator';
import LeadCapture from './components/LeadCapture';
import ContentGeneratorModal from './components/ContentGeneratorModal';
import PropertyAnalysisModal from './components/PropertyAnalysisModal';
import EmailComposerModal from './components/EmailComposerModal';
import LogInvestmentModal from './components/LogInvestmentModal';
import ToastManager from './components/ToastManager';
import { useReferralCode } from './hooks/useReferralCode';
import { useContentGeneration } from './hooks/useContentGeneration';
import { usePropertyAnalysis } from './hooks/usePropertyAnalysis';
import PropertyFilters from './components/PropertyFilters';
import Dashboard from './components/Dashboard';
import { useAnalytics } from './hooks/useAnalytics';
import { useLeads } from './hooks/useLeads';
import { ThemeProvider } from './hooks/useTheme';
import { useFavorites } from './hooks/useFavorites';
import { useEmailComposer } from './hooks/useEmailComposer';
import { useConversions } from './hooks/useConversions';
import { useAchievements } from './hooks/useAchievements';
import { useLibrary } from './hooks/useLibrary';
import LibraryView from './components/LibraryView';
import LibraryPreviewModal from './components/LibraryPreviewModal';
import { useAIInsights } from './hooks/useAIInsights';
import AIInsightsModal from './components/AIInsightsModal';
import SettingsView from './components/SettingsView';
import { useProactiveAssistant } from './hooks/useProactiveAssistant';
import AIProactiveAssistant from './components/AIProactiveAssistant';
import { useWhatsNew } from './hooks/useWhatsNew';
import WhatsNewModal from './components/WhatsNewModal';
import { useGoal } from './hooks/useGoal';
import { generateStrategicPlan } from './services/geminiService';
import { useToast } from './hooks/useToast';
import AIPlanModal from './components/AIPlanModal';
import { TranslationProvider, useTranslation } from './hooks/useTranslation';

type View = 'properties' | 'dashboard' | 'library' | 'settings';

const AppContent: React.FC = () => {
  const [properties] = useState<Property[]>(MOCK_PROPERTIES);
  const [isLoading, setIsLoading] = useState(true);
  const [investment, setInvestment] = useState(50000);
  const [activeView, setActiveView] = useState<View>('properties');
  const [syncedInvestment, setSyncedInvestment] = useState<number | null>(null);
  
  const { addToast } = useToast();
  const { language, t } = useTranslation();

  const { referralCode, setReferralCode: handleSetReferralCode, clearReferralCode } = useReferralCode();
  const { modalState, modalHandlers } = useContentGeneration(referralCode, language);
  const { analysisModalState, analysisModalHandlers } = usePropertyAnalysis(language);
  const { analytics, clicks, logClick, clearClicks } = useAnalytics(properties);
  const { leads, addLead, clearLeads } = useLeads();
  const { favorites, isFavorite, toggleFavorite, clearFavorites } = useFavorites();
  const { composerState, composerHandlers } = useEmailComposer(referralCode, language);
  const { conversions, addConversion, conversionAnalytics, clearConversions } = useConversions();
  const { savedContent, addContentToLibrary, deleteContentFromLibrary, clearLibrary } = useLibrary();
  const { insightsState, insightsHandlers } = useAIInsights(language);
  const { showWhatsNew, whatsNewLog, closeWhatsNew } = useWhatsNew(t);
  const { monthlyGoal, setGoal } = useGoal();

  // AI Strategic Plan Modal State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [strategicPlan, setStrategicPlan] = useState<AIStrategicPlan | null>(null);

  
  const totalEarnings = useMemo(() => {
    return conversions.reduce((sum, conv) => sum + (conv.investmentAmount * 0.015), 0);
  }, [conversions]);
  
  const { achievements, clearSeenAchievements } = useAchievements({
    referralCode,
    favorites,
    clicks,
    leads,
    conversions,
    totalEarnings
  }, t);
  
  const { currentTip, dismissTip } = useProactiveAssistant({
      referralCode,
      leads,
      conversions,
      clicks,
      properties,
      savedContent,
      analytics,
      totalEarnings,
  }, language);

  // Log Investment Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [leadToLog, setLeadToLog] = useState<Lead | null>(null);

  // Library Preview Modal State
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<SavedContent | null>(null);

  // Filter and Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [minRoi, setMinRoi] = useState(0);
  const [sortBy, setSortBy] = useState('roi_desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<PropertyType | 'All'>('All');
  const [bedroomsFilter, setBedroomsFilter] = useState(0); // 0 means 'Any'

  useEffect(() => {
    // Simulate initial data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const displayInvestment = syncedInvestment ?? investment;
  const isCalculatorSynced = syncedInvestment !== null;

  const earnings = useMemo(() => {
    const referrerBonus = displayInvestment * 0.015;
    const refereeBonus = displayInvestment * 0.005;
    return { referrerBonus, refereeBonus };
  }, [displayInvestment]);

  const roiRange = useMemo(() => {
    if (properties.length === 0) return { min: 0, max: 20 };
    const rois = properties.map(p => p.roi);
    return {
      min: Math.floor(Math.min(...rois)),
      max: Math.ceil(Math.max(...rois)),
    };
  }, [properties]);
  
  useEffect(() => {
    if (!isLoading) {
        setMinRoi(roiRange.min);
    }
  }, [isLoading, roiRange.min]);

  const filteredProperties = useMemo(() => {
    let sortedProperties = [...properties];

    // Sorting
    switch (sortBy) {
        case 'roi_desc':
            sortedProperties.sort((a, b) => b.roi - a.roi);
            break;
        case 'roi_asc':
            sortedProperties.sort((a, b) => a.roi - b.roi);
            break;
        case 'investment_asc':
            sortedProperties.sort((a, b) => a.minInvestment - b.minInvestment);
            break;
        case 'investment_desc':
            sortedProperties.sort((a, b) => b.minInvestment - a.minInvestment);
            break;
    }
    
    // Filtering
    return sortedProperties.filter(p => {
        const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.location.toLowerCase().includes(searchTerm.toLowerCase());
        const roiMatch = p.roi >= minRoi;
        const favoritesMatch = !showFavoritesOnly || favorites.includes(p.id);
        const typeMatch = propertyTypeFilter === 'All' || p.type === propertyTypeFilter;
        const bedroomsMatch = bedroomsFilter === 0 || (bedroomsFilter < 4 ? p.bedrooms === bedroomsFilter : p.bedrooms >= 4);

        return searchMatch && roiMatch && favoritesMatch && typeMatch && bedroomsMatch;
    });

  }, [properties, searchTerm, minRoi, sortBy, showFavoritesOnly, favorites, propertyTypeFilter, bedroomsFilter]);

  const funnelMetrics = useMemo(() => {
    const totalClicks = clicks.length;
    const totalLeads = leads.length;
    const totalConversions = conversions.length;

    const clickToLeadRate = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0;
    const leadToConversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
    const clickToConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    return {
        totalClicks,
        totalLeads,
        totalConversions,
        clickToLeadRate,
        leadToConversionRate,
        clickToConversionRate,
    };
  }, [clicks, leads, conversions]);

  const handleInvestClick = (propertyId: string) => {
    logClick(propertyId);
    window.open(`https://realiste.ai/?ref=${referralCode}`, '_blank');
  };
  
  const areFiltersActive = useMemo(() => {
    return searchTerm !== '' || minRoi !== roiRange.min || showFavoritesOnly || propertyTypeFilter !== 'All' || bedroomsFilter !== 0;
  }, [searchTerm, minRoi, showFavoritesOnly, roiRange.min, propertyTypeFilter, bedroomsFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setMinRoi(roiRange.min);
    setShowFavoritesOnly(false);
    setPropertyTypeFilter('All');
    setBedroomsFilter(0);
  };

  const handleComposeEmail = (lead: Lead) => {
    composerHandlers.openComposer(lead, analytics.topProperty);
  };

  const handleOpenLogModal = (lead: Lead) => {
    setLeadToLog(lead);
    setIsLogModalOpen(true);
  };
  
  const handleLogConversion = (conversion: Omit<Conversion, 'timestamp' | 'leadEmail'>) => {
    if (leadToLog) {
      addConversion({ ...conversion, leadEmail: leadToLog.email });
    }
    setIsLogModalOpen(false);
    setLeadToLog(null);
  };

  const handleOpenPreview = (item: SavedContent) => {
    setSelectedLibraryItem(item);
  };
  
  const handleClosePreview = () => {
    setSelectedLibraryItem(null);
  }

  const handleDeleteFromPreview = (id: string) => {
    deleteContentFromLibrary(id);
    handleClosePreview();
  }

  const handleGetInsights = () => {
    const topPropertyByEarningsId = Object.keys(conversionAnalytics.earningsByProperty).sort((a, b) => conversionAnalytics.earningsByProperty[b] - conversionAnalytics.earningsByProperty[a])[0];
    const topPropertyByEarnings = properties.find(p => p.id === topPropertyByEarningsId) || null;

    insightsHandlers.fetchAndShowInsights({
        totalClicks: analytics.totalClicks,
        totalLeads: leads.length,
        totalConversions: conversions.length,
        totalEarnings,
        topPropertyByClicks: analytics.topProperty,
        topPropertyByEarnings,
    });
  };

  const handleClearAllData = () => {
    if (window.confirm(t('settings.data.clearAllConfirmation'))) {
        clearReferralCode();
        clearClicks();
        clearLeads();
        clearConversions();
        clearFavorites();
        clearLibrary();
        clearSeenAchievements();
    }
  };

  const handleProactiveAction = (tip: ProactiveTip) => {
    switch(tip.action.type) {
        case 'compose_email':
            composerHandlers.openComposer(tip.action.payload as Lead, analytics.topProperty);
            break;
        case 'generate_content':
            modalHandlers.startGeneration(tip.action.payload as Property);
            break;
        case 'navigate':
            setActiveView(tip.action.payload as View);
            break;
    }
    dismissTip(tip.id);
  };

  const handleManualInvestmentChange = (newInvestment: number) => {
    setSyncedInvestment(null);
    setInvestment(newInvestment);
  };

  const handlePropertyHover = (property: Property | null) => {
    if (property) {
      setSyncedInvestment(property.minInvestment);
    } else {
      setSyncedInvestment(null);
    }
  };
  
  const handleGeneratePlan = async () => {
    if (monthlyGoal <= 0) {
        addToast(t('settings.goals.errorSetGoal'), "error");
        return;
    }
    setIsGeneratingPlan(true);
    setStrategicPlan(null);
    setIsPlanModalOpen(true);

    try {
        const topPropertyByEarningsId = Object.keys(conversionAnalytics.earningsByProperty).sort((a, b) => conversionAnalytics.earningsByProperty[b] - conversionAnalytics.earningsByProperty[a])[0];
        const topPropertyByEarnings = properties.find(p => p.id === topPropertyByEarningsId) || null;
        
        const plan = await generateStrategicPlan(monthlyGoal, {
            totalEarnings,
            totalConversions: conversions.length,
            topPropertyByEarnings,
        }, language);
        setStrategicPlan(plan);
    } catch (error) {
        addToast(t('aiErrors.failedStrategicPlan'), "error");
        setIsPlanModalOpen(false);
    } finally {
        setIsGeneratingPlan(false);
    }
  };

  return (
    <>
      <div className="min-h-screen text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Header activeView={activeView} onNavigate={setActiveView} />

          <main className="mt-12">
             {activeView === 'properties' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1 space-y-8">
                        <Calculator 
                            investment={displayInvestment} 
                            onInvestmentChange={handleManualInvestmentChange} 
                            earnings={earnings} 
                            isSynced={isCalculatorSynced}
                        />
                        <LeadCapture onAddLead={addLead} />
                    </div>

                    <div className="lg:col-span-2">
                        <PropertyFilters
                            searchTerm={searchTerm}
                            onSearchTermChange={setSearchTerm}
                            minRoi={minRoi}
                            onMinRoiChange={setMinRoi}
                            sortBy={sortBy}
                            onSortByChange={setSortBy}
                            roiRange={roiRange}
                            showFavoritesOnly={showFavoritesOnly}
                            onShowFavoritesOnlyChange={setShowFavoritesOnly}
                            propertyTypeFilter={propertyTypeFilter}
                            onPropertyTypeFilterChange={setPropertyTypeFilter}
                            bedroomsFilter={bedroomsFilter}
                            onBedroomsFilterChange={setBedroomsFilter}
                            disabled={isLoading}
                            areFiltersActive={areFiltersActive}
                            onResetFilters={handleResetFilters}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {isLoading 
                            ? Array.from({ length: 6 }).map((_, index) => (
                                <PropertyCardSkeleton key={index} />
                                )) 
                            : filteredProperties.length > 0 ? (
                                filteredProperties.map((property, index) => (
                                <PropertyCard 
                                    key={property.id}
                                    property={property}
                                    referralCode={referralCode}
                                    onGenerateClick={modalHandlers.startGeneration}
                                    onAnalysisClick={analysisModalHandlers.fetchAndShowAnalysis}
                                    onInvestClick={handleInvestClick}
                                    isFavorite={isFavorite(property.id)}
                                    onToggleFavorite={toggleFavorite}
                                    onHover={handlePropertyHover}
                                    clicks={analytics.clicksByProperty[property.id] || 0}
                                    earnings={conversionAnalytics.earningsByProperty[property.id] || 0}
                                    animationDelay={`${index * 50}ms`}
                                />
                                ))
                            ) : (
                                <div className="md:col-span-2 text-center py-16 bg-gray-100 dark:bg-gray-800/50 rounded-2xl">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('properties.noResults.title')}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">{t('properties.noResults.description')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
             ) : activeView === 'dashboard' ? (
                <Dashboard
                    analytics={analytics}
                    conversionAnalytics={conversionAnalytics}
                    funnelMetrics={funnelMetrics}
                    clicks={clicks}
                    properties={properties} 
                    leads={leads} 
                    isFavorite={isFavorite} 
                    onComposeEmail={handleComposeEmail}
                    conversions={conversions}
                    onLogInvestment={handleOpenLogModal}
                    totalEarnings={totalEarnings}
                    achievements={achievements}
                    onGetInsights={handleGetInsights}
                    isGeneratingInsights={insightsState.isLoading}
                    monthlyGoal={monthlyGoal}
                />
             ) : activeView === 'library' ? (
                <LibraryView
                    savedContent={savedContent}
                    onCardClick={handleOpenPreview}
                />
             ) : (
                <SettingsView
                    referralCode={referralCode}
                    onSaveReferralCode={handleSetReferralCode}
                    onClearReferralCode={clearReferralCode}
                    onClearClicks={clearClicks}
                    onClearLeads={clearLeads}
                    onClearConversions={clearConversions}
                    onClearFavorites={clearFavorites}
                    onClearLibrary={clearLibrary}
                    onClearSeenAchievements={clearSeenAchievements}
                    onClearAllData={handleClearAllData}
                    monthlyGoal={monthlyGoal}
                    onSetGoal={setGoal}
                    onGeneratePlan={handleGeneratePlan}
                    isGeneratingPlan={isGeneratingPlan}
                />
             )}
          </main>
        </div>
      </div>
      
      {modalState.isOpen && modalState.property && (
        <ContentGeneratorModal
          property={modalState.property}
          messages={modalState.messages}
          isLoading={modalState.isLoading}
          onClose={modalHandlers.closeModal}
          onSendMessage={modalHandlers.sendMessage}
          onStartOver={modalHandlers.startOver}
          imageUrl={modalState.imageUrl}
          isImageLoading={modalState.isImageLoading}
          onRegenerateImage={modalHandlers.regenerateImage}
          hashtags={modalState.hashtags}
          isGeneratingHashtags={modalState.isGeneratingHashtags}
          onSaveToLibrary={(p, t, i) => addContentToLibrary(p, t, i)}
        />
      )}
      
      {analysisModalState.isOpen && analysisModalState.property && (
        <PropertyAnalysisModal
            property={analysisModalState.property}
            report={analysisModalState.report}
            isLoading={analysisModalState.isLoading}
            onClose={analysisModalHandlers.closeAnalysisModal}
        />
      )}

      {composerState.isOpen && composerState.lead && (
        <EmailComposerModal
            lead={composerState.lead}
            email={composerState.email}
            isLoading={composerState.isLoading}
            onClose={composerHandlers.closeComposer}
        />
      )}

      {isLogModalOpen && leadToLog && (
        <LogInvestmentModal
            lead={leadToLog}
            properties={properties}
            onClose={() => setIsLogModalOpen(false)}
            onLogConversion={handleLogConversion}
        />
      )}

      {selectedLibraryItem && (
        <LibraryPreviewModal
            item={selectedLibraryItem}
            onClose={handleClosePreview}
            onDelete={handleDeleteFromPreview}
        />
      )}

      {insightsState.isOpen && (
        <AIInsightsModal
            report={insightsState.report}
            isLoading={insightsState.isLoading}
            onClose={insightsHandlers.closeInsightsModal}
        />
      )}
      
      {isPlanModalOpen && (
        <AIPlanModal
            plan={strategicPlan}
            isLoading={isGeneratingPlan}
            onClose={() => setIsPlanModalOpen(false)}
            goal={monthlyGoal}
        />
      )}

      <AIProactiveAssistant
        tip={currentTip}
        onDismiss={dismissTip}
        onAction={handleProactiveAction}
      />

      {showWhatsNew && (
        <WhatsNewModal
            isOpen={showWhatsNew}
            onClose={closeWhatsNew}
            changelog={whatsNewLog}
        />
      )}
    </>
  );
};


const App: React.FC = () => {
  return (
    <TranslationProvider>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
          <ToastManager />
        </ToastProvider>
      </ThemeProvider>
    </TranslationProvider>
  );
};

export default App;
