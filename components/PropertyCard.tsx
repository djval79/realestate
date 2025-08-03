
import React from 'react';
import { Property } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { AnalysisIcon } from './icons/AnalysisIcon';
import { HeartIcon } from './icons/HeartIcon';
import { BedIcon } from './icons/BedIcon';
import { BathIcon } from './icons/BathIcon';
import { AreaIcon } from './icons/AreaIcon';
import PropertyStatsTooltip from './PropertyStatsTooltip';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { useTranslation } from '../hooks/useTranslation';

interface PropertyCardProps {
  property: Property;
  referralCode: string;
  onGenerateClick: (property: Property) => void;
  onAnalysisClick: (property: Property) => void;
  onInvestClick: (propertyId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
  onHover: (property: Property | null) => void;
  clicks: number;
  earnings: number;
  animationDelay: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const PropertyCard: React.FC<PropertyCardProps> = ({ 
    property, 
    referralCode, 
    onGenerateClick, 
    onAnalysisClick, 
    onInvestClick, 
    isFavorite, 
    onToggleFavorite, 
    onHover,
    clicks,
    earnings,
    animationDelay 
}) => {
  const { t } = useTranslation();
  const riskColor = property.riskScore <= 3 ? 'text-green-500 dark:text-green-400' : property.riskScore <= 6 ? 'text-yellow-500 dark:text-yellow-400' : 'text-red-500 dark:text-red-400';
  const isInvestDisabled = !referralCode;
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite(property.id);
  }

  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20 hover:border-cyan-400 dark:hover:border-cyan-500 hover:-translate-y-1 flex flex-col relative opacity-0 animate-fade-in-up"
      style={{ animationDelay }}
      onMouseEnter={() => onHover(property)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <div className="relative group">
            <PropertyStatsTooltip clicks={clicks} earnings={earnings} />
            <div 
                className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white cursor-pointer"
                aria-label={t('propertyCard.statsTooltip.title')}
            >
                <InformationCircleIcon className="w-6 h-6" />
            </div>
        </div>
        <button 
            onClick={handleFavoriteClick}
            className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:text-red-500 transition-all duration-200 transform hover:scale-110 active:scale-95"
            aria-label={isFavorite ? t('propertyCard.removeFromFav') : t('propertyCard.addToFav')}
        >
            <HeartIcon filled={isFavorite} className="w-6 h-6" />
        </button>
      </div>
      <img src={property.imageUrl} alt={property.name} className="w-full aspect-video object-cover" />
      
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-bold uppercase text-cyan-500 dark:text-cyan-400">{property.type}</span>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{property.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{property.location}</p>

        <div className="flex items-center justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 border-t border-b border-gray-200 dark:border-gray-700 py-3">
            <div className="flex items-center gap-2">
                <BedIcon className="w-5 h-5"/>
                <span>{property.bedrooms} {t('propertyCard.beds')}</span>
            </div>
            <div className="flex items-center gap-2">
                <BathIcon className="w-5 h-5"/>
                <span>{property.bathrooms} {t('propertyCard.baths')}</span>
            </div>
             <div className="flex items-center gap-2">
                <AreaIcon className="w-5 h-5"/>
                <span>{property.area.toLocaleString()} {t('propertyCard.sqft')}</span>
            </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-2xl font-bold text-green-500 dark:text-green-400">{property.roi}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{t('propertyCard.projRoi')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(property.minInvestment)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{t('propertyCard.minInvest')}</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${riskColor}`}>{property.riskScore}/10</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">{t('propertyCard.riskScore')}</div>
          </div>
        </div>

        <div className="mt-auto space-y-3 pt-4">
           <button 
             onClick={() => onGenerateClick(property)}
             disabled={!referralCode}
             title={!referralCode ? t('propertyCard.generatePostDisabled') : t('propertyCard.generatePost')}
             className="w-full flex items-center justify-center bg-cyan-500 text-gray-900 font-bold py-2.5 px-4 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105 disabled:bg-cyan-500/50 disabled:cursor-not-allowed disabled:hover:scale-100"
           >
              <SparklesIcon className="w-5 h-5 mr-2"/>
              {t('propertyCard.generatePost')}
           </button>
           <div className="grid grid-cols-2 gap-3">
             <button
               onClick={() => onAnalysisClick(property)}
               className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-transform duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105"
             >
               <AnalysisIcon className="w-5 h-5" />
               {t('propertyCard.aiAnalysis')}
             </button>
             <button 
               onClick={() => onInvestClick(property.id)}
               disabled={isInvestDisabled}
               title={isInvestDisabled ? t('propertyCard.investDisabled') : t('propertyCard.investAndEarn')}
               className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 px-4 rounded-lg transition-transform duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 disabled:bg-gray-200/50 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed disabled:hover:scale-100"
             >
               {t('propertyCard.investAndEarn')}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
