
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    children: React.ReactNode;
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Define position styles
    const getPositionStyles = () => {
        switch (position) {
            case 'bottom':
                return {
                    top: 'calc(100% + 5px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    arrow: {
                        top: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(180deg)',
                        borderTop: 'border-t-black/80'
                    }
                };
            case 'left':
                return {
                    top: '50%',
                    right: 'calc(100% + 5px)',
                    transform: 'translateY(-50%)',
                    arrow: {
                        top: '50%',
                        right: '-4px',
                        transform: 'translateY(-50%) rotate(90deg)',
                        borderTop: 'border-t-black/80'
                    }
                };
            case 'right':
                return {
                    top: '50%',
                    left: 'calc(100% + 5px)',
                    transform: 'translateY(-50%)',
                    arrow: {
                        top: '50%',
                        left: '-4px',
                        transform: 'translateY(-50%) rotate(-90deg)',
                        borderTop: 'border-t-black/80'
                    }
                };
            case 'top':
            default:
                return {
                    bottom: 'calc(100% + 5px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    arrow: {
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderTop: 'border-t-black/80'
                    }
                };
        }
    };

    const positionStyles = getPositionStyles();

    return (
        <div 
            className="relative inline-flex"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0, x: position === 'left' ? 10 : position === 'right' ? -10 : 0 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0, x: position === 'left' ? 10 : position === 'right' ? -10 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 px-2 py-1 text-xs font-medium text-white bg-black/80 rounded-md whitespace-nowrap"
                        style={{ 
                            top: positionStyles.top, 
                            bottom: positionStyles.bottom,
                            left: positionStyles.left,
                            right: positionStyles.right,
                            transform: positionStyles.transform
                        }}
                    >
                        {text}
                        <div 
                            className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-solid border-transparent border-t-black/80"
                            style={{ 
                                top: positionStyles.arrow.top,
                                bottom: positionStyles.arrow.bottom,
                                left: positionStyles.arrow.left,
                                right: positionStyles.arrow.right,
                                transform: positionStyles.arrow.transform
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};