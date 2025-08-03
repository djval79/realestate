
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface CalculatorProps {
  investment: number;
  onInvestmentChange: (value: number) => void;
  earnings: {
    referrerBonus: number;
    refereeBonus: number;
  };
  isSynced: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Calculator: React.FC<CalculatorProps> = ({ investment, onInvestmentChange, earnings, isSynced }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('calculator.title')}</h2>
        {isSynced && (
          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/50 px-2 py-1 rounded-md animate-fade-in">
              {t('calculator.synced')}
          </span>
        )}
      </div>
      
      <div className="mb-6">
        <label htmlFor="investment-range" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          {t('calculator.investmentLabel')}: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(investment)}</span>
        </label>
        <input
          id="investment-range"
          type="range"
          min="10000"
          max="500000"
          step="1000"
          value={investment}
          onChange={(e) => onInvestmentChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('calculator.yourBonus')}</h3>
          <p className="text-3xl font-extrabold text-green-500 dark:text-green-400 mt-1">
            {formatCurrency(earnings.referrerBonus)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{t('calculator.yourBonusSub')}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('calculator.theirBonus')}</h3>
          <p className="text-3xl font-extrabold text-cyan-500 dark:text-cyan-400 mt-1">
            {formatCurrency(earnings.refereeBonus)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{t('calculator.theirBonusSub')}</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
