import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, X, Info } from 'lucide-react';
import { cn } from '../utils/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  type?: ToastType;
  title?: string;
}

interface ToastMessage {
  message: string;
  type: ToastType;
  id: number;
  title?: string;
}

// Global toast state and function
let toastQueue: ToastMessage[] = [];
let listeners: Array<(toast: ToastMessage | null) => void> = [];

export const showToast = (message: string, options?: ToastOptions) => {
  const toast = {
    message,
    type: options?.type || 'success',
    id: Date.now(),
    title: options?.title
  };
  
  toastQueue.push(toast);
  
  // Notify all listeners about the new toast
  listeners.forEach(listener => listener(toast));
};

// Hook for components to use toast functionality
export const useToast = () => {
  return { showToast };
};

export const Toast: React.FC<{
  message: string;
  type?: ToastType;
  onClose: () => void;
  title?: string;
}> = ({ 
  message, 
  type = 'success', 
  onClose,
  title 
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return { 
          icon: <CheckCircle2 className="h-5 w-5" />,
          bgColor: "bg-gradient-to-r from-emerald-500/90 to-teal-500/90",
          iconBg: "bg-white/20",
          iconColor: "text-white",
          progressColor: "bg-white/30"
        };
      case 'error':
        return { 
          icon: <X className="h-5 w-5" />,
          bgColor: "bg-gradient-to-r from-rose-500/90 to-pink-500/90", 
          iconBg: "bg-white/20",
          iconColor: "text-white",
          progressColor: "bg-white/30"
        };
      case 'warning':
        return { 
          icon: <AlertTriangle className="h-5 w-5" />,
          bgColor: "bg-gradient-to-r from-amber-500/90 to-orange-500/90", 
          iconBg: "bg-white/20",
          iconColor: "text-white",
          progressColor: "bg-white/30"
        };
      case 'info':
      default:
        return { 
          icon: <Info className="h-5 w-5" />,
          bgColor: "bg-gradient-to-r from-blue-500/90 to-indigo-500/90", 
          iconBg: "bg-white/20",
          iconColor: "text-white",
          progressColor: "bg-white/30"
        };
    }
  };

  const { icon, bgColor, iconBg, iconColor, progressColor } = getIconAndColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 280, 
          damping: 20 
        } 
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8, 
        y: 20,
        transition: { duration: 0.2 } 
      }}
      className="fixed bottom-6 right-6 z-50 max-w-sm"
    >
      <div 
        className={cn(
          bgColor,
          "rounded-xl shadow-lg backdrop-blur-lg overflow-hidden",
          "border border-white/10 text-white",
          "flex items-center"
        )}
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex-shrink-0 p-4">
          <div className={cn(
            "rounded-full w-10 h-10 flex items-center justify-center",
            iconBg,
            iconColor
          )}>
            {icon}
          </div>
        </div>
        
        <div className="flex-1 p-4 pr-2">
          {title && (
            <h4 className="font-bold text-white text-base mb-0.5">
              {title}
            </h4>
          )}
          <p className="text-white/90 text-sm leading-snug">
            {message}
          </p>
          
          {/* Progress bar that animates away */}
          <div className="h-1 w-full mt-3 bg-white/10 rounded overflow-hidden">
            <motion.div 
              className={cn("h-full rounded", progressColor)}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 p-4 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

// Global toast container
export const ToastContainer: React.FC = () => {
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);

  const closeToast = useCallback(() => {
    setCurrentToast(null);
    
    // Check if there are more toasts in the queue
    setTimeout(() => {
      if (toastQueue.length > 0) {
        const nextToast = toastQueue.shift();
        if (nextToast) {
          setCurrentToast(nextToast);
        }
      }
    }, 300);
  }, []);

  useEffect(() => {
    // Register this component as a listener
    const handleNewToast = (toast: ToastMessage | null) => {
      if (toast && !currentToast) {
        // If there's no active toast, show this one immediately
        setCurrentToast(toast);
        // And remove it from the queue
        toastQueue = toastQueue.filter(t => t.id !== toast.id);
      }
    };
    
    listeners.push(handleNewToast);
    
    return () => {
      // Cleanup listener on unmount
      listeners = listeners.filter(listener => listener !== handleNewToast);
    };
  }, [currentToast]);

  return (
    <AnimatePresence>
      {currentToast && (
        <Toast
          key={currentToast.id}
          message={currentToast.message}
          type={currentToast.type}
          title={currentToast.title}
          onClose={closeToast}
        />
      )}
    </AnimatePresence>
  );
};

export default ToastContainer;