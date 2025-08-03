
import React from 'react';

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ id, checked, onChange, disabled = false }) => {
  const bgColor = checked ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600';
  const knobPosition = checked ? 'translate-x-6' : 'translate-x-1';

  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex items-center h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${bgColor} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition ease-in-out duration-200 ${knobPosition}`}
      />
    </button>
  );
};

export default Switch;
