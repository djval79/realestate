
import React, { useMemo, useState } from 'react';
import { Property } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface TopPropertiesListProps {
    clicksByProperty: Record<string, number>;
    earningsByProperty: Record<string, number>;
    properties: Property[];
    isFavorite: (propertyId: string) => boolean;
}

type SortMode = 'clicks' | 'earnings';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

const TopPropertiesList: React.FC<TopPropertiesListProps> = ({ clicksByProperty, earningsByProperty, properties, isFavorite }) => {
    const [sortMode, setSortMode] = useState<SortMode>('clicks');

    const sortedProperties = useMemo(() => {
        const propertyData = properties.map(p => ({
            ...p,
            clicks: clicksByProperty[p.id] || 0,
            earnings: earningsByProperty[p.id] || 0,
        }));

        if (sortMode === 'clicks') {
            return propertyData.sort((a, b) => b.clicks - a.clicks);
        } else {
            return propertyData.sort((a, b) => b.earnings - a.earnings);
        }
    }, [clicksByProperty, earningsByProperty, properties, sortMode]);

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Properties</h3>
                <div className="flex items-center text-sm bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
                    <button onClick={() => setSortMode('clicks')} className={`px-3 py-1 font-semibold rounded-md transition-colors ${sortMode === 'clicks' ? 'bg-white dark:bg-gray-800 shadow text-cyan-600 dark:text-cyan-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}>
                        By Clicks
                    </button>
                    <button onClick={() => setSortMode('earnings')} className={`px-3 py-1 font-semibold rounded-md transition-colors ${sortMode === 'earnings' ? 'bg-white dark:bg-gray-800 shadow text-cyan-600 dark:text-cyan-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}>
                        By Earnings
                    </button>
                </div>
            </div>
            <div className="space-y-4">
                {sortedProperties.filter(p => (sortMode === 'clicks' ? p.clicks > 0 : p.earnings > 0)).slice(0, 5).map((property, index, arr) => (
                    <div key={property.id} className={`flex items-center justify-between ${index !== 0 ? 'pt-4 border-t border-gray-200 dark:border-gray-700/50' : ''}`}>
                        <div className="flex items-center min-w-0">
                            <img src={property.imageUrl} alt={property.name} className="w-12 h-12 rounded-lg object-cover mr-4 flex-shrink-0" />
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    {isFavorite(property.id) && <HeartIcon filled className="w-4 h-4 text-red-500 flex-shrink-0" />}
                                    <p className="font-semibold text-gray-900 dark:text-white truncate">{property.name}</p>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{property.location}</p>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {sortMode === 'clicks' ? property.clicks : formatCurrency(property.earnings)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {sortMode === 'clicks' ? 'clicks' : 'earnings'}
                            </p>
                        </div>
                    </div>
                ))}
                 {sortedProperties.filter(p => (sortMode === 'clicks' ? p.clicks > 0 : p.earnings > 0)).length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No data for this view yet.</p>
                )}
            </div>
        </div>
    );
};

export default TopPropertiesList;
