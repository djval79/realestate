
import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { CheckIcon } from './icons/CheckIcon';

interface ReferralCodeManagerProps {
  code: string;
  onSave: (code: string) => void;
}

const ReferralCodeManager: React.FC<ReferralCodeManagerProps> = ({ code, onSave }) => {
  const [currentCode, setCurrentCode] = useState(code);
  const { addToast } = useToast();

  useEffect(() => {
    setCurrentCode(code);
  }, [code]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCode.trim()) {
      onSave(currentCode.trim());
      addToast('Referral code saved successfully!', 'success');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Referral Code</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">Set your code to personalize investment links and AI-generated content.</p>
      
      <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={currentCode}
          onChange={(e) => setCurrentCode(e.target.value)}
          placeholder="Enter your code"
          required
          className="flex-grow bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Your Referral Code"
        />
        <button
          type="submit"
          disabled={!currentCode || currentCode === code}
          className="bg-cyan-500 text-gray-900 font-bold py-2.5 px-5 rounded-lg transition-all duration-200 hover:bg-cyan-400 hover:scale-105 disabled:bg-cyan-500/50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
        >
          Save Code
        </button>
      </form>
    </div>
  );
};

export default ReferralCodeManager;