
import { useState, useEffect } from 'react';

const REFERRAL_CODE_KEY = 'referralCode';

export const useReferralCode = () => {
  const [referralCode, setReferralCode] = useState<string>('');

  useEffect(() => {
    const savedCode = localStorage.getItem(REFERRAL_CODE_KEY);
    if (savedCode) {
      setReferralCode(savedCode);
    }
  }, []);

  const setReferralCodeAndStore = (code: string) => {
    localStorage.setItem(REFERRAL_CODE_KEY, code);
    setReferralCode(code);
  };

  const clearReferralCode = () => {
    localStorage.removeItem(REFERRAL_CODE_KEY);
    setReferralCode('');
  };

  return { referralCode, setReferralCode: setReferralCodeAndStore, clearReferralCode };
};