import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  Power, 
  PowerOff, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  ChevronDown, 
  Maximize2, 
  Minimize2,
  Play,
  Square,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define types for the nested objects
type Hardware = {
  nightSafeDepository: string;
  magneticCardReader: string;
  doorAccess: string;
  cashHandler: string;
  depository: string;
  receiptPrinter: string;
  journalPrinter: string;
  securityCamera: string;
  statementPrinter: string;
};

type Sensors = {
  vibrationHeat: string;
  doorContact: string;
  silentSignal: string;
  electronicEnclosure: string;
  depositBin: string;
  cardBin: string;
  rejectBin: string;
  cassette1: string;
  cassette2: string;
  cassette3: string;
  cassette4: string;
};

type Cassette = {
  id: number;
  amount: string;
  currentCount: number;
  initialCount: number;
  denomination: number;
};

type HardwareFitness = {
  timeOfDayClock: string;
  highOrderComm6: string;
  systemDisk: string;
  magneticCardReader: string;
  cashHandler: string;
  depository: string;
  receiptPrinter: string;
  journalPrinter: string;
  enhancedThermalStatementPrinter: string;
  nightSafeDepository: string;
  encryptor: string;
  securityCamera: string;
};

type SupplyStatus = {
  cassette1: string;
  cassette2: string;
  cassette3: string;
  cassette4: string;
  cardCaptureBin: string;
  cashHandlerRejectBin: string;
  depositBin: string;
  receiptPaper: string;
  journalPrinter: string;
  nightSafe: string;
  statementPaper: string;
  statementPrinter: string;
};

type AdditionalHardware = {
  doorAccess: string;
  flexDisk: string;
  cassette1: string;
  cassette2: string;
  cassette3: string;
  cassette4: string;
  statementPrinter: string;
  signageDisplay: string;
  systemDisplay: string;
  mediaEntryIndicators: string;
  envelopeDispenser: string;
};

type TerminalData = {
  status: string;
  atmType: string;
  event: string;
  hardware: Hardware;
  sensors: Sensors;
  cassettes: Cassette[];
  hardwareFitness: HardwareFitness;
  supplyStatus: SupplyStatus;
  additionalHardware: AdditionalHardware;
};

type TerminalDataMap = {
  [key: string]: TerminalData;
};

// Terminal data
const terminalData: TerminalDataMap = {
  'ADDCON01': {
    status: 'offline',
    atmType: 'ASTRA',
    event: 'OFFLINE',
    hardware: {
      nightSafeDepository: 'NOT CONFIGURED',
      magneticCardReader: 'TRACK 123 SMART',
      doorAccess: 'NOT CONFIGURED',
      cashHandler: 'STANDARD CONFIGURED',
      depository: 'NOT CONFIGURED',
      receiptPrinter: 'PLAIN PAPER',
      journalPrinter: 'INTEGRATED',
      securityCamera: 'NOT CONFIGURED',
      statementPrinter: 'NOT CONFIGURED'
    },
    sensors: {
      vibrationHeat: 'INACTIVE_OUT',
      doorContact: 'INACTIVE_OUT',
      silentSignal: 'INACTIVE_OUT',
      electronicEnclosure: 'INACTIVE_OUT',
      depositBin: 'INACTIVE_OUT',
      cardBin: 'ACTIVE_IN',
      rejectBin: 'ACTIVE_IN',
      cassette1: 'ACTIVE_IN',
      cassette2: 'INACTIVE_OUT',
      cassette3: 'INACTIVE_OUT',
      cassette4: 'INACTIVE_OUT'
    },
    cassettes: [
      { id: 1, amount: '0 of 0', currentCount: 0, initialCount: 0, denomination: 100 },
      { id: 2, amount: '0 of 0', currentCount: 0, initialCount: 0, denomination: 200 },
      { id: 3, amount: '4000 of 4000', currentCount: 8, initialCount: 8, denomination: 500 },
      { id: 4, amount: '46000 of 46000', currentCount: 23, initialCount: 23, denomination: 2000 }
    ],
    hardwareFitness: {
      timeOfDayClock: 'NO_ERROR',
      highOrderComm6: 'NO_ERROR',
      systemDisk: 'NO_ERROR',
      magneticCardReader: 'NO_ERROR',
      cashHandler: 'NO_ERROR',
      depository: 'NO_ERROR',
      receiptPrinter: 'NO_ERROR',
      journalPrinter: 'NO_ERROR',
      enhancedThermalStatementPrinter: 'NO_ERROR',
      nightSafeDepository: 'NO_ERROR',
      encryptor: 'NO_ERROR',
      securityCamera: 'NO_ERROR'
    },
    supplyStatus: {
      cassette1: 'NOT_CONFIGURED',
      cassette2: 'NOT_CONFIGURED',
      cassette3: 'MEDIA_LOW',
      cassette4: 'MEDIA_LOW',
      cardCaptureBin: 'GOOD_STATE',
      cashHandlerRejectBin: 'GOOD_STATE',
      depositBin: 'NOT_CONFIGURED',
      receiptPaper: 'GOOD_STATE',
      journalPrinter: 'GOOD_STATE',
      nightSafe: 'NOT_CONFIGURED',
      statementPaper: 'NOT_CONFIGURED',
      statementPrinter: 'GOOD_STATE'
    },
    additionalHardware: {
      doorAccess: 'NO_ERROR',
      flexDisk: 'NO_ERROR',
      cassette1: 'FATAL_ERROR',
      cassette2: 'NO_ERROR',
      cassette3: 'NO_ERROR',
      cassette4: 'NO_ERROR',
      statementPrinter: 'NO_ERROR',
      signageDisplay: 'NO_ERROR',
      systemDisplay: 'NO_ERROR',
      mediaEntryIndicators: 'NO_ERROR',
      envelopeDispenser: 'NO_ERROR'
    }
  },
  'ADDCON02': {
    status: 'online',
    atmType: 'ASTRA',
    event: 'ONLINE',
    hardware: {
      nightSafeDepository: 'CONFIGURED',
      magneticCardReader: 'TRACK 123 SMART',
      doorAccess: 'CONFIGURED',
      cashHandler: 'STANDARD CONFIGURED',
      depository: 'CONFIGURED',
      receiptPrinter: 'THERMAL PAPER',
      journalPrinter: 'INTEGRATED',
      securityCamera: 'CONFIGURED',
      statementPrinter: 'CONFIGURED'
    },
    sensors: {
      vibrationHeat: 'ACTIVE_IN',
      doorContact: 'ACTIVE_IN',
      silentSignal: 'INACTIVE_OUT',
      electronicEnclosure: 'ACTIVE_IN',
      depositBin: 'ACTIVE_IN',
      cardBin: 'ACTIVE_IN',
      rejectBin: 'ACTIVE_IN',
      cassette1: 'ACTIVE_IN',
      cassette2: 'ACTIVE_IN',
      cassette3: 'ACTIVE_IN',
      cassette4: 'ACTIVE_IN'
    },
    cassettes: [
      { id: 1, amount: '2000 of 2000', currentCount: 20, initialCount: 20, denomination: 100 },
      { id: 2, amount: '3000 of 3000', currentCount: 15, initialCount: 15, denomination: 200 },
      { id: 3, amount: '5000 of 5000', currentCount: 10, initialCount: 10, denomination: 500 },
      { id: 4, amount: '50000 of 50000', currentCount: 25, initialCount: 25, denomination: 2000 }
    ],
    hardwareFitness: {
      timeOfDayClock: 'NO_ERROR',
      highOrderComm6: 'NO_ERROR',
      systemDisk: 'NO_ERROR',
      magneticCardReader: 'NO_ERROR',
      cashHandler: 'NO_ERROR',
      depository: 'NO_ERROR',
      receiptPrinter: 'NO_ERROR',
      journalPrinter: 'NO_ERROR',
      enhancedThermalStatementPrinter: 'NO_ERROR',
      nightSafeDepository: 'NO_ERROR',
      encryptor: 'NO_ERROR',
      securityCamera: 'NO_ERROR'
    },
    supplyStatus: {
      cassette1: 'GOOD_STATE',
      cassette2: 'GOOD_STATE',
      cassette3: 'GOOD_STATE',
      cassette4: 'GOOD_STATE',
      cardCaptureBin: 'GOOD_STATE',
      cashHandlerRejectBin: 'GOOD_STATE',
      depositBin: 'GOOD_STATE',
      receiptPaper: 'GOOD_STATE',
      journalPrinter: 'GOOD_STATE',
      nightSafe: 'GOOD_STATE',
      statementPaper: 'GOOD_STATE',
      statementPrinter: 'GOOD_STATE'
    },
    additionalHardware: {
      doorAccess: 'NO_ERROR',
      flexDisk: 'NO_ERROR',
      cassette1: 'NO_ERROR',
      cassette2: 'NO_ERROR',
      cassette3: 'NO_ERROR',
      cassette4: 'NO_ERROR',
      statementPrinter: 'NO_ERROR',
      signageDisplay: 'NO_ERROR',
      systemDisplay: 'NO_ERROR',
      mediaEntryIndicators: 'NO_ERROR',
      envelopeDispenser: 'NO_ERROR'
    }
  }
};

// Tooltip component
const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div
          className="absolute z-50 px-2 py-1 text-xs text-sm text-white bg-black/80 rounded-md shadow-lg whitespace-nowrap"
          style={{ bottom: "calc(100% + 5px)", left: "50%", transform: "translateX(-50%)" }}
        >
          {text}
          <div className="absolute w-2 h-2 bg-black/80 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

export const TerminalMonitoring: React.FC = () => {
  const [selectedTerminal, setSelectedTerminal] = useState('ADDCON01');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    cassettes: true
  });

  const terminals = Object.keys(terminalData).map(id => ({
    id,
    status: terminalData[id].status
  }));

  const currentTerminal = terminalData[selectedTerminal];

  console.log("Selected Terminal:", selectedTerminal);
  console.log("Current Terminal Data:", currentTerminal);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
    console.log("Expanded Sections:", expandedSections);
  };

  const getStatusColor = (status: string) => {
    if (status === 'GOOD_STATE' || status === 'NO_ERROR' || status === 'CONFIGURED' || status === 'ACTIVE_IN') {
      return 'text-green-500';
    } else if (status === 'MEDIA_LOW' || status === 'INACTIVE_OUT') {
      return 'text-yellow-500';
    } else if (status === 'NOT_CONFIGURED') {
      return 'text-gray-500';
    } else {
      return 'text-red-500';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'GOOD_STATE' || status === 'NO_ERROR' || status === 'CONFIGURED' || status === 'ACTIVE_IN') {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    } else if (status === 'MEDIA_LOW' || status === 'INACTIVE_OUT') {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    } else if (status === 'NOT_CONFIGURED') {
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  // Group data into sections for better organization
  const dataSections = [
    {
      id: 'overview',
      title: 'ATM Device Information',
      priority: 'high',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-[#FFD700]/5 p-4">
            <h3 className="text-[#FFD700] text-sm mb-3">ATM INFORMATION</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-[#FFD700]/5">
                  <td className="py-2 text-white/70 text-sm w-1/3">ATM TYPE</td>
                  <td className="py-2 text-white text-sm">{currentTerminal.atmType}</td>
                </tr>
                <tr className="border-b border-[#FFD700]/5">
                  <td className="py-2 text-white/70 text-sm w-1/3">TERMINAL ID</td>
                  <td className="py-2 text-white">{selectedTerminal}</td>
                </tr>
                <tr>
                  <td className="py-2 text-white/70 text-sm">EVENT</td>
                  <td className={`py-2 ${
                    currentTerminal.event === 'ONLINE' 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {currentTerminal.event}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-[#FFD700]/5 p-4">
            <h3 className="text-[#FFD700] text-sm text-sm mb-3">CASSETTE SUMMARY</h3>
            <div className="space-y-2">
              {currentTerminal.cassettes.map((cassette) => (
                <div key={cassette.id} className="flex justify-between items-center">
                  <span className="text-white/70">CASSETTE {cassette.id} ({cassette.denomination})</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-[#FFD700]/10 rounded-full h-2">
                      <motion.div 
                        className="h-full rounded-full bg-[#FFD700]"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${cassette.currentCount > 0 ? (cassette.currentCount / cassette.initialCount) * 100 : 0}%` 
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                      ></motion.div>
                    </div>
                    <span className="text-white text-xs">{cassette.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cassettes',
      title: 'Cassette Information',
      count: currentTerminal.cassettes.filter(c => c.currentCount > 0).length,
      priority: 'high',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-[#FFD700]/10 bg-black/30">
                <th className="py-2 px-3 text-left text-[#FFD700]/70 text-sm"></th>
                <th className="py-2 px-3 text-left text-[#FFD700]/70 text-sm">AMOUNT</th>
                <th className="py-2 px-3 text-left text-[#FFD700]/70 text-sm">CURRENT</th>
                <th className="py-2 px-3 text-left text-[#FFD700]/70 text-sm">INITIAL</th>
                <th className="py-2 px-3 text-left text-[#FFD700]/70 text-sm">DENOM</th>
              </tr>
            </thead>
            <tbody>
              {currentTerminal.cassettes.map((cassette, index, array) => (
                <motion.tr 
                  key={cassette.id} 
                  className={`${index < array.length - 1 ? "border-b border-[#FFD700]/5" : ""} hover:bg-[#FFD700]/5 transition-colors`}
                  whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="py-2 px-3 text-white/70 text-sm">CASSETTE {cassette.id}</td>
                  <td className="py-2 px-3 text-white">{cassette.amount}</td>
                  <td className="py-2 px-3 text-white">{cassette.currentCount}</td>
                  <td className="py-2 px-3 text-white">{cassette.initialCount}</td>
                  <td className="py-2 px-3 text-white">{cassette.denomination}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 'hardware',
      title: 'Hardware Configuration',
      priority: 'medium',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <tbody>
              {Object.entries(currentTerminal.hardware).map(([key, value], index, array) => {
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase());
                
                return (
                  <motion.tr 
                    key={key} 
                    className={`${index < array.length - 1 ? "border-b border-[#FFD700]/5" : ""} hover:bg-[#FFD700]/5 transition-colors`}
                    whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="py-2 px-3 text-white/70 text-sm w-1/2">{formattedKey}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2 group">
                        <motion.div 
                          className="transform hover:scale-110 hover:rotate-3 transition-transform duration-200"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          {getStatusIcon(value)}
                        </motion.div>
                        <motion.span 
                          className={`${getStatusColor(value)} group-hover:text-sm transition-all`}
                          whileHover={{ x: 3 }}
                        >
                          {value}
                        </motion.span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 'sensors',
      title: 'Sensor Status Information',
      count: Object.values(currentTerminal.sensors).filter(s => s === 'ACTIVE_IN').length,
      priority: 'medium',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <tbody>
              {Object.entries(currentTerminal.sensors).map(([key, value], index, array) => {
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase());
                
                return (
                  <motion.tr 
                    key={key} 
                    className={`${index < array.length - 1 ? "border-b border-[#FFD700]/5" : ""} hover:bg-[#FFD700]/5 transition-colors`}
                    whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="py-2 px-3 text-white/70 text-sm w-1/2">{formattedKey}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2 group">
                        {value === 'ACTIVE_IN' ? (
                          <motion.span 
                            className="w-2 h-2 bg-green-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          ></motion.span>
                        ) : (
                          <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                        )}
                        <motion.span 
                          className={`${getStatusColor(value)} group-hover:text-sm transition-all`}
                          whileHover={{ x: 3 }}
                        >
                          {value}
                        </motion.span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 'hardwareFitness',
      title: 'Hardware Fitness Information',
      count: Object.values(currentTerminal.hardwareFitness).filter(s => s !== 'NO_ERROR').length,
      priority: 'low',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <tbody>
              {Object.entries(currentTerminal.hardwareFitness).map(([key, value], index, array) => {
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase());
                
                return (
                  <motion.tr 
                    key={key} 
                    className={`${index < array.length - 1 ? "border-b border-[#FFD700]/5" : ""} hover:bg-[#FFD700]/5 transition-colors`}
                    whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="py-2 px-3 text-white/70 text-sm w-1/2">{formattedKey}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2 group">
                        <motion.div 
                          className="transform hover:scale-110 hover:rotate-3 transition-transform duration-200"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          {getStatusIcon(value)}
                        </motion.div>
                        <motion.span 
                          className={`${getStatusColor(value)} group-hover:text-sm transition-all`}
                          whileHover={{ x: 3 }}
                        >
                          {value}
                        </motion.span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 'supplyStatus',
      title: 'Supply Status Information',
      count: Object.values(currentTerminal.supplyStatus).filter(s => s === 'MEDIA_LOW').length,
      priority: 'medium',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <tbody>
              {Object.entries(currentTerminal.supplyStatus).map(([key, value], index, array) => {
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase());
                
                return (
                  <motion.tr 
                    key={key} 
                    className={`${index < array.length - 1 ? "border-b border-[#FFD700]/5" : ""} hover:bg-[#FFD700]/5 transition-colors`}
                    whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="py-2 px-3 text-white/70 text-sm w-1/2">{formattedKey}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2 group">
                        <motion.div 
                          className="transform hover:scale-110 hover:rotate-3 transition-transform duration-200"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          {getStatusIcon(value)}
                        </motion.div>
                        <motion.span 
                          className={`${getStatusColor(value)} group-hover:text-sm transition-all`}
                          whileHover={{ x: 3 }}
                        >
                          {value}
                        </motion.span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 'additionalHardware',
      title: 'Additional Hardware Status Information',
      count: Object.values(currentTerminal.additionalHardware).filter(s => s !== 'NO_ERROR').length,
      priority: 'low',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <tbody>
              {Object.entries(currentTerminal.additionalHardware).map(([key, value], index, array) => {
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase());
                
                return (
                  <motion.tr 
                    key={key} 
                    className={`${index < array.length - 1 ? "border-b border-[#FFD700]/5" : ""} hover:bg-[#FFD700]/5 transition-colors`}
                    whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="py-2 px-3 text-white/70 text-sm w-1/2">{formattedKey}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2 group">
                        <motion.div 
                          className="transform hover:scale-110 hover:rotate-3 transition-transform duration-200"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          {getStatusIcon(value)}
                        </motion.div>
                        <motion.span 
                          className={`${getStatusColor(value)} group-hover:text-sm transition-all`}
                          whileHover={{ x: 3 }}
                        >
                          {value}
                        </motion.span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="pt-16">
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-[#FFD700]">Terminal Monitoring</h1>
            <p className="text-white/60 text-sm">Monitor and manage ATM terminals</p>
          </div>
          
          {/* Terminal Selection Dropdown */}
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64 z-50">
              <motion.button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-gradient-to-br from-[#101010] via-[#1A1A1A] to-[#101010] rounded-lg border border-[#FFD700]/10 p-3 flex justify-between items-center hover:border-[#FFD700]/30 transition-all duration-300"
                whileHover={{ borderColor: "rgba(255, 215, 0, 0.3)", scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    className={`w-3 h-3 rounded-full ${currentTerminal.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}
                    animate={currentTerminal.status === 'online' ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                  <span className="text-white text-sm">{selectedTerminal}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    currentTerminal.status === 'online' 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {currentTerminal.status.toUpperCase()}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-[#FFD700]" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    className="absolute mt-2 w-full bg-gradient-to-br from-[#101010] via-[#1A1A1A] to-[#101010] rounded-lg border border-[#FFD700]/10 shadow-xl overflow-hidden z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {terminals.map((terminal, index) => (
                        <motion.div 
                          key={terminal.id}
                          onClick={() => {
                            setSelectedTerminal(terminal.id);
                            setIsDropdownOpen(false);
                            console.log("Selected Terminal:", terminal.id);
                          }}
                          className={`flex items-center justify-between p-3 cursor-pointer transition-all ${
                            selectedTerminal === terminal.id 
                              ? 'bg-[#FFD700]/10 text-[#FFD700]' 
                              : 'hover:bg-white/5 text-white/80'
                          }`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ backgroundColor: selectedTerminal === terminal.id ? "rgba(255, 215, 0, 0.2)" : "rgba(255, 255, 255, 0.05)" }}
                        >
                          <span>{terminal.id}</span>
                          {terminal.status === 'online' ? (
                            <div className="flex items-center gap-1">
                              <motion.span 
                                className="w-2 h-2 bg-green-500 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              ></motion.span>
                              <Power className="w-4 h-4 text-green-500" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <PowerOff className="w-4 h-4 text-red-500" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Tooltip text="Refresh Data">
              <motion.button 
                className={`p-3 bg-[#1e4976] text-white rounded-full hover:bg-[#1e4976]/80 transition-colors flex items-center justify-center ${isRefreshing ? 'opacity-70 pointer-events-none' : ''}`}
                onClick={refreshData}
                disabled={isRefreshing}
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(30, 73, 118, 0.5)" }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </Tooltip>
          </div>
        </motion.div>

        {/* Control Panel */}
        <motion.div 
          className="bg-gradient-to-br from-[#101010] via-[#1A1A1A] to-[#101010] rounded-xl border border-[#FFD700]/10 p-4 shadow-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ borderColor: "rgba(255, 215, 0, 0.2)", boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.5)" }}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-3 h-3 rounded-full ${currentTerminal.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}
                animate={currentTerminal.status === 'online' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              <h2 className="text-xl font-semibold text-white">
                {selectedTerminal} - {currentTerminal.atmType}
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                currentTerminal.status === 'online' 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {currentTerminal.status.toUpperCase()}
              </span>
            </div>
            <div className="flex gap-3">
              <Tooltip text="Enable Terminal">
                <motion.button 
                  className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(22, 163, 74, 0.3)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="w-5 h-5" />
                </motion.button>
              </Tooltip>
              <Tooltip text="Disable Terminal">
                <motion.button 
                  className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(220, 38, 38, 0.3)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Square className="w-5 h-5" />
                </motion.button>
              </Tooltip>
              <Tooltip text="Terminal Details">
                <motion.button 
                  className="p-3 bg-[#FFD700]/20 text-[#FFD700] rounded-full hover:bg-[#FFD700]/30 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(255, 215, 0, 0.3)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Info className="w-5 h-5" />
                </motion.button>
              </Tooltip>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="flex flex-col gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {dataSections.map((section, index) => (
            <motion.div 
              key={section.id}
              className="bg-gradient-to-br from-[#101010] via-[#1A1A1A] to-[#101010] rounded-xl border border-[#FFD700]/10 overflow-hidden shadow-lg hover:shadow-[0_5px_30px_-15px_rgba(255,215,0,0.15)] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
              whileHover={{ borderColor: "rgba(255, 215, 0, 0.2)" }}
            >
              <motion.div 
                className="bg-gradient-to-r from-[#1e1e1e] to-[#252525] p-4 flex justify-between items-center border-b border-[#FFD700]/10 cursor-pointer hover:bg-[#252525] transition-colors"
                onClick={() => toggleSection(section.id)}
                whileHover={{ backgroundColor: "rgba(37, 37, 37, 0.8)" }}
              >
                <motion.h3 
                  className="font-semibold text-[white]/60 flex items-center gap-2"
                  whileHover={{ color: "rgba(255, 215, 0, 0.8)", x: 5 }}
                >
                  {section.title}
                  {section.count && (
                    <motion.span 
                      className="px-2 py-0.5 text-xs rounded-full bg-[#FFD700]/10 text-[#FFD700]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {section.count}
                    </motion.span>
                  )}
                </motion.h3>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: expandedSections[section.id] ? -90 : 90 }}
                  animate={{ rotate: expandedSections[section.id] ? 0 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {expandedSections[section.id] ? (
                    <Minimize2 className="w-5 h-5 text-[white]/60" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-[white]/60" />
                  )}
                </motion.div>
              </motion.div>
              <AnimatePresence>
                {expandedSections[section.id] && (
                  <motion.div 
                    className="p-4 block"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {section.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TerminalMonitoring;