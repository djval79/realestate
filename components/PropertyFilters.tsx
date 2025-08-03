
import React from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowUturnLeftIcon } from './icons/ArrowUturnLeftIcon';
import Switch from './Switch';
import { PropertyType } from '../types';

interface PropertyFiltersProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    minRoi: number;
    onMinRoiChange: (roi: number) => void;
    sortBy: string;
    onSortByChange: (sort: string) => void;
    roiRange: { min: number, max: number };
    showFavoritesOnly: boolean;
    onShowFavoritesOnlyChange: (show: boolean) => void;
    propertyTypeFilter: PropertyType | 'All';
    onPropertyTypeFilterChange: (type: PropertyType | 'All') => void;
    bedroomsFilter: number;
    onBedroomsFilterChange: (bedrooms: number) => void;
    disabled: boolean;
    areFiltersActive: boolean;
    onResetFilters: () => void;
}

const FilterButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    disabled: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, disabled, children }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                isActive
                    ? 'bg-cyan-500 text-white dark:text-gray-900'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            } disabled:opacity-50`}
        >
            {children}
        </button>
    );
};

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
    searchTerm,
    onSearchTermChange,
    minRoi,
    onMinRoiChange,
    sortBy,
    onSortByChange,
    roiRange,
    showFavoritesOnly,
    onShowFavoritesOnlyChange,
    propertyTypeFilter,
    onPropertyTypeFilterChange,
    bedroomsFilter,
    onBedroomsFilterChange,
    disabled,
    areFiltersActive,
    onResetFilters
}) => {
    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-4 mb-8 space-y-4">
            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* Search Input */}
                <div className="lg:col-span-2">
                     <label htmlFor="search-input" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <input 
                            id="search-input"
                            type="text"
                            placeholder="Name or location..."
                            value={searchTerm}
                            onChange={(e) => onSearchTermChange(e.target.value)}
                            disabled={disabled}
                            className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* ROI Slider */}
                <div className="lg:col-span-2">
                    <label htmlFor="roi-range" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Min. ROI: <span className="font-bold text-gray-900 dark:text-white">{minRoi}%</span>
                    </label>
                    <input
                        id="roi-range"
                        type="range"
                        min={roiRange.min}
                        max={roiRange.max}
                        step="0.1"
                        value={minRoi}
                        onChange={(e) => onMinRoiChange(parseFloat(e.target.value))}
                        disabled={disabled}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="lg:col-span-1">
                     <label htmlFor="sort-by" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Sort By
                    </label>
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value)}
                        disabled={disabled}
                        className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                    >
                        <option value="roi_desc">ROI (High to Low)</option>
                        <option value="roi_asc">ROI (Low to High)</option>
                        <option value="investment_asc">Investment (Low to High)</option>
                        <option value="investment_desc">Investment (High to Low)</option>
                    </select>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end pt-4 border-t border-gray-200 dark:border-gray-700/50">
                 {/* Property Type */}
                <div>
                     <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Property Type
                    </label>
                    <div className="flex items-center space-x-2">
                        <FilterButton onClick={() => onPropertyTypeFilterChange('All')} isActive={propertyTypeFilter === 'All'} disabled={disabled}>All</FilterButton>
                        <FilterButton onClick={() => onPropertyTypeFilterChange('Apartment')} isActive={propertyTypeFilter === 'Apartment'} disabled={disabled}>Apartment</FilterButton>
                        <FilterButton onClick={() => onPropertyTypeFilterChange('Villa')} isActive={propertyTypeFilter === 'Villa'} disabled={disabled}>Villa</FilterButton>
                    </div>
                </div>

                {/* Bedrooms */}
                 <div>
                     <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Bedrooms
                    </label>
                    <div className="flex items-center space-x-2">
                        {[0, 1, 2, 3, 4].map(num => (
                             <FilterButton 
                                key={num}
                                onClick={() => onBedroomsFilterChange(num)} 
                                isActive={bedroomsFilter === num} 
                                disabled={disabled}
                             >
                                {num === 0 ? 'Any' : (num === 4 ? '4+' : num)}
                            </FilterButton>
                        ))}
                    </div>
                </div>

                {/* Favorites Toggle & Reset */}
                <div className="lg:col-span-1 flex items-end justify-between sm:justify-end gap-4 h-full">
                    <div className="flex flex-col items-center">
                        <label htmlFor="favorites-toggle" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                            Favorites
                        </label>
                        <Switch
                            id="favorites-toggle"
                            checked={showFavoritesOnly}
                            onChange={onShowFavoritesOnlyChange}
                            disabled={disabled}
                        />
                    </div>
                     {areFiltersActive && (
                        <button onClick={onResetFilters} disabled={disabled} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 self-end" title="Reset Filters">
                           <ArrowUturnLeftIcon className="w-5 h-5"/>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyFilters;