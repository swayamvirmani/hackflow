import { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 font-sans">
            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border animate-slideIn ${
                type === 'success' 
                    ? 'bg-primary-50 border-primary-700 text-primary-700' 
                    : 'bg-red-50 border-red-700 text-red-700'
            }`}>
                {type === 'success' ? (
                    <FiCheck className="w-5 h-5" />
                ) : (
                    <FiX className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    );
};

export default Toast;