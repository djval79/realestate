
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useToast } from '../hooks/useToast';
import { ToastType } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { CloseIcon } from './icons/CloseIcon';

const toastConfig = {
    success: {
        icon: CheckCircleIcon,
        barClass: 'bg-green-500',
        iconClass: 'text-green-500',
    },
    error: {
        icon: XCircleIcon,
        barClass: 'bg-red-500',
        iconClass: 'text-red-500',
    },
    info: {
        icon: CheckCircleIcon, // Replace with Info icon if available
        barClass: 'bg-cyan-500',
        iconClass: 'text-cyan-500',
    }
}

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [onDismiss]);

    const config = toastConfig[type];
    const Icon = config.icon;

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg flex w-full max-w-sm overflow-hidden animate-fade-in-right">
            <div className={`w-1.5 ${config.barClass}`} />
            <div className="flex items-center px-4 py-3">
                <Icon className={`w-7 h-7 ${config.iconClass}`} />
                <p className="ml-3 text-sm font-semibold text-gray-800 dark:text-white">{message}</p>
            </div>
            <button onClick={onDismiss} className="ml-auto p-3 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors">
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

const ToastManager: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return ReactDOM.createPortal(
    <div className="fixed top-0 right-0 z-[100] p-4 space-y-3 w-full max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastManager;