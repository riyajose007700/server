import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Activity, AlertCircle, Server, Zap, Shield, ShieldAlert } from 'lucide-react';

interface ConnectionStatusPanelProps {
  title: string;
  ipAddress?: string;
  port?: string;
  icon: 'network' | 'transaction';
}

export const ConnectionStatusPanel: React.FC<ConnectionStatusPanelProps> = ({
  title,
  ipAddress = '192.168.1.1',
  port = '8080',
  icon
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      try {
        // Simple connection check - just try to fetch from the IP:port
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        await fetch(`http://${ipAddress}:${port}/`, {
          method: 'HEAD',
          signal: controller.signal,
          mode: 'no-cors'
        });
        
        clearTimeout(timeoutId);
        setIsActive(true);
      } catch (error) {
        console.error(`Connection failed to ${ipAddress}:${port}`);
        setIsActive(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Check connection immediately and then every 30 seconds
    checkConnection();
    const intervalId = setInterval(checkConnection, 30000);

    return () => clearInterval(intervalId);
  }, [ipAddress, port]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="relative h-[300px] overflow-hidden bg-gradient-to-br from-[#101010] via-[#1A1A1A] to-[#101010] 
                rounded-xl p-6 shadow-lg border flex flex-col justify-between"
      style={{ 
        borderColor: isActive ? 'rgba(255, 213, 0, 0.2)' : 'rgba(239, 68, 68, 0.2)'
      }}
    >
      {/* Background glow effect */}
      {isActive && (
        <motion.div 
          className="absolute inset-0 bg-[#FFD500]/5 blur-3xl rounded-full"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2], 
            scale: [0.8, 1.2, 0.8],
            x: ['0%', '10%', '0%'],
            y: ['0%', '10%', '0%']
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      )}
      
      {!isActive && (
        <motion.div 
          className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1], 
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      )}
      
      {/* Header with title and status */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-[#FFD500] text-lg font-medium mb-6">{title}</h3>
          {isLoading ? (
            <div className="flex items-center">
              <div className="relative mr-3">
                <motion.div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(255, 213, 0, 0.2)',
                      '0 0 0 8px rgba(255, 213, 0, 0.1)',
                      '0 0 0 0 rgba(255, 213, 0, 0)'
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-[#FFD500]/20 flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-[#FFD500]"
                      animate={{ 
                        scale: [1, 0.9, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </motion.div>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-white font-medium text-sm">CHECKING</span>
                  <motion.div 
                    className="ml-2 px-2 py-0.5 bg-[#FFD500]/10 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-white text-xs">LOADING</span>
                  </motion.div>
                </div>
                <div className="text-[#FFD500]/60 text-xs mt-0.5">Checking connection...</div>
              </div>
            </div>
          ) : isActive ? (
            <div className="flex items-center">
              <div className="relative mr-3">
                <motion.div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(34, 197, 94, 0.2)',
                      '0 0 0 8px rgba(34, 197, 94, 0.1)',
                      '0 0 0 0 rgba(34, 197, 94, 0)'
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-green-500"
                      animate={{ 
                        scale: [1, 0.9, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </motion.div>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-white-400 font-medium text-sm">ONLINE</span>
                  <motion.div 
                    className="ml-2 px-2 py-0.5 bg-green-500/10 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-green-400 text-xs">ACTIVE</span>
                  </motion.div>
                </div>
                <div className="text-green-400/60 text-xs mt-0.5">Secure Connection</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="relative mr-3">
                <motion.div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(239, 68, 68, 0.2)',
                      '0 0 0 8px rgba(239, 68, 68, 0.1)',
                      '0 0 0 0 rgba(239, 68, 68, 0)'
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-red-500"
                      animate={{ 
                        scale: [1, 0.9, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </motion.div>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-white-400 font-medium text-sm">OFFLINE</span>
                  <motion.div 
                    className="ml-2 px-2 py-0.5 bg-red-500/10 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-red-400 text-xs">INACTIVE</span>
                  </motion.div>
                </div>
                <div className="text-red-400/60 text-xs mt-0.5">Connection Failed</div>
              </div>
            </div>
          )}
        </div>
        
        <motion.div 
          className={`p-3 rounded-full ${
            isLoading 
              ? 'bg-[#FFD500]/10 text-[#FFD500]' 
              : isActive 
                ? 'bg-[#FFD500]/10 text-[#FFD500]' 
                : 'bg-red-500/10 text-red-400'
          }`}
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon === 'network' ? 
            (isActive ? <Wifi size={24} /> : <WifiOff size={24} />) : 
            (isActive ? <Activity size={24} /> : <AlertCircle size={24} />)
          }
        </motion.div>
      </div>
      
      {/* Connection details */}
      <div className="relative z-10">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <motion.div 
            className="bg-black/30 rounded-lg p-3 backdrop-blur-sm border border-white/5"
            whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center mb-1">
              <Server size={12} className="text-[#FFD500]/60 mr-1" />
              <p className="text-[#FFD500]/60 text-xs">IP Address</p>
            </div>
            <p className="text-white text-sm font-mono">{ipAddress}</p>
          </motion.div>
          <motion.div 
            className="bg-black/30 rounded-lg p-3 backdrop-blur-sm border border-white/5"
            whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center mb-1">
              <Zap size={12} className="text-[#FFD500]/60 mr-1" />
              <p className="text-[#FFD500]/60 text-xs">Port</p>
            </div>
            <p className="text-white text-sm font-mono">{port}</p>
          </motion.div>
        </div>
      </div>
      
      {/* Status indicator section */}
      <div className="relative z-10 mt-auto">
        {isLoading ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-[#FFD500] w-5 h-5 mr-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </motion.div>
              <div>
                <p className="text-white text-sm font-medium">Checking</p>
                <p className="text-[#FFD500]/60 text-xs">Testing connection...</p>
              </div>
            </div>
            
            <motion.div
              className="flex space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-6 bg-[#FFD500] rounded-full"
                  initial={{ height: 0 }}
                  animate={{ 
                    height: [
                      Math.random() * 6 + 3, 
                      Math.random() * 12 + 6, 
                      Math.random() * 6 + 3
                    ] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          </div>
        ) : isActive ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="text-green-400 w-5 h-5 mr-2" />
              <div>
                <p className="text-white text-sm font-medium">Protected</p>
                <p className="text-green-400/60 text-xs">End-to-end encryption</p>
              </div>
            </div>
            
            <motion.div
              className="flex space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-6 bg-green-500 rounded-full"
                  initial={{ height: 0 }}
                  animate={{ 
                    height: [
                      Math.random() * 12 + 6, 
                      Math.random() * 18 + 12, 
                      Math.random() * 12 + 6
                    ] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldAlert className="text-red-400 w-5 h-5 mr-2" />
              <div>
                <p className="text-white text-sm font-medium">Disconnected</p>
                <p className="text-red-400/60 text-xs">No secure channel</p>
              </div>
            </div>
            
            <motion.div
              className="flex space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1 bg-red-500/30 rounded-full"
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      {isActive && (
        <>
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFD500]/5 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </>
      )}
    </motion.div>
  );
};