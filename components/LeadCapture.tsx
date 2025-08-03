
import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';

interface LeadCaptureProps {
  onAddLead: (email: string) => void;
}

const LeadCapture: React.FC<LeadCaptureProps> = ({ onAddLead }) => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onAddLead(email);
      addToast(t('toasts.leadCaptured'), 'success');
      setEmail('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('leadCapture.title')}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{t('leadCapture.description')}</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('leadCapture.placeholder')}
          required
          className="flex-grow bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          className="bg-cyan-500 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-transform duration-200 hover:bg-cyan-400 hover:scale-105"
        >
          {t('leadCapture.button')}
        </button>
      </form>
    </div>
  );
};

export default LeadCapture;
