import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Terminal, Users, ChevronDown, CheckCircle2 } from 'lucide-react';
import { authFetch } from '../utils/authUtils';
import { useAuthStore } from '../store/authStore';
import { Toast } from './Toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface CommandPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionExpired: () => void;
  
}

interface CommandData {
  type: 'Terminal ID' | 'Terminal Group';
  terminalId?: string;
  terminalGroup?: string;
  command: string;
}

interface TerminalResponse {
  success: boolean;
  message: string;
  data: string[];
}

const commands = [
  'Full Download',
  'Mini Download',
  'Check Download',
  'Open',
  'Supply Counter',
  'Sync',
  'Close'
];

const API_URL = 'http://122.165.73.156:8888';

export const CommandPopup: React.FC<CommandPopupProps> = ({ isOpen, onClose, onSessionExpired }) => {
  const [type, setType] = useState<'Terminal ID' | 'Terminal Group'>('Terminal ID');
  const [terminalId, setTerminalId] = useState('');
  const [terminalGroup, setTerminalGroup] = useState('');
  const [command, setCommand] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState<'terminal' | 'command' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [terminals, setTerminals] = useState<string[]>([]);
  const [terminalGroups, setTerminalGroups] = useState<string[]>([]);
  const [isLoadingTerminals, setIsLoadingTerminals] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  const { logout } = useAuthStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const handleSessionExpired = () => {
    logout();
    onSessionExpired();
    onClose();
  };

  useEffect(() => {
    const fetchTerminalGroups = async () => {
      if (type === 'Terminal Group' && isOpen) {
        setIsLoadingGroups(true);
        setGroupsError(null);
        try {
          const response = await authFetch(`${API_URL}/api/terminals/groups/get`);
          const data: TerminalResponse = await response.json();
          if (data.success) {
            setTerminalGroups(data.data);
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          if (error instanceof Error && error.message === 'Session expired. Please login again.') {
            handleSessionExpired();
          } else {
            console.error('Error fetching groups:', error);
            setGroupsError('Failed to load groups. Please try again.');
          }
        } finally {
          setIsLoadingGroups(false);
        }
      }
    };

    fetchTerminalGroups();
  }, [type, isOpen]);

  useEffect(() => {
    const fetchTerminals = async () => {
      if (type === 'Terminal ID' && isOpen) {
        setIsLoadingTerminals(true);
        setTerminalError(null);
        try {
          const response = await authFetch(`${API_URL}/api/terminals/get`);
          const data: TerminalResponse = await response.json();
          if (data.success) {
            setTerminals(data.data);
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          if (error instanceof Error && error.message === 'Session expired. Please login again.') {
            handleSessionExpired();
          } else {
            console.error('Error fetching terminals:', error);
            setTerminalError('Failed to load terminals. Please try again.');
          }
        } finally {
          setIsLoadingTerminals(false);
        }
      }
    };

    fetchTerminals();
  }, [type, isOpen]);

  const handleSend = async () => {
    const payload = {
      type,
      terminalId: type === 'Terminal ID' ? terminalId : undefined,
      terminalGroup: type === 'Terminal Group' ? terminalGroup : undefined,
      command
    };

    setIsLoading(true);

    try {
      const response = await authFetch(`${API_URL}/api/commands/send`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send command');
      }
      const data = await response.json();

      const target = type === 'Terminal ID' ? terminalId : `${terminalGroup} group`;
     
      if (data.success) {
        setToastMessage(`Command "${command}" sent successfully to ${target}`);
        setToastType("success")
        setShowToast(true);
      } else {
        // throw new Error(data.message);
        setToastMessage(`Command "${command}" sent failed to ${target}`);
        setToastType("error")
        setShowToast(true);
      }


      onClose();
      // Reset form
      setTerminalId('');
      setTerminalGroup('');
      setCommand('');
    } catch (error) {
      if (error instanceof Error && error.message === 'Session expired. Please login again.') {
        handleSessionExpired();
      } else {
        // console.error('Error sending command:', error);
        setToastMessage(`Error sending command: ${error}`);
        setToastType("error")
        setShowToast(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = () => {
    if (type === 'Terminal ID') {
      return terminalId !== '' && command !== '';
    }
    return terminalGroup !== '' && command !== '';
  };

  const CustomSelect = ({ 
    value, 
    options, 
    onChange, 
    placeholder,
    isOpen,
    onToggle,
    isLoading = false,
    error = null
  }: { 
    value: string;
    options: string[];
    onChange: (value: string) => void;
    placeholder: string;
    isOpen: boolean;
    onToggle: () => void;
    isLoading?: boolean;
    error?: string | null;
  }) => (
    <div className="relative">
      <button
        onClick={onToggle}
        disabled={isLoading}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-left text-white focus:outline-none focus:border-[#FFD700]/30 transition-all hover:bg-black/30 flex items-center justify-between"
      >
        <span className={value ? 'text-white' : 'text-white/40'}>
          {isLoading ? 'Loading...' : value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
      <AnimatePresence>
        {isOpen && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    onToggle();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center justify-between group"
                >
                  <span className={`text-white ${value === option ? 'text-[#FFD700]' : ''}`}>
                    {option}
                  </span>
                  {value === option && (
                    <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] rounded-2xl border border-white/10 p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Send Command</h2>
                <p className="text-white/40 text-sm">Configure and send command to terminals</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white/60" />
              </motion.button>
            </div>

            <div className="space-y-6">
              {/* Terminal Type Selection */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-3">
                  Terminal Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setType('Terminal ID')}
                    className={`relative flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                      type === 'Terminal ID'
                        ? 'bg-[#FFD700] border-[#FFD700] text-black'
                        : 'border-white/10 text-white hover:bg-white/5'
                    }`}
                  >
                    <Terminal className="w-4 h-4" />
                    <span className="font-medium">Terminal ID</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setType('Terminal Group')}
                    className={`relative flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                      type === 'Terminal Group'
                        ? 'bg-[#FFD700] border-[#FFD700] text-black'
                        : 'border-white/10 text-white hover:bg-white/5'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Terminal Group</span>
                  </motion.button>
                </div>
              </div>

              {/* Terminal Selection */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-3">
                  {type === 'Terminal ID' ? 'Select Terminal' : 'Select Group'}
                </label>
                <CustomSelect
                  value={type === 'Terminal ID' ? terminalId : terminalGroup}
                  options={type === 'Terminal ID' ? terminals : terminalGroups}
                  onChange={type === 'Terminal ID' ? setTerminalId : setTerminalGroup}
                  placeholder={type === 'Terminal ID' ? 'Choose terminal...' : 'Choose group...'}
                  isOpen={isSelectOpen === 'terminal'}
                  onToggle={() => setIsSelectOpen(isSelectOpen === 'terminal' ? null : 'terminal')}
                  isLoading={type === 'Terminal ID' ? isLoadingTerminals : isLoadingGroups}
                  error={type === 'Terminal ID' ? terminalError : groupsError}
                />
              </div>

              {/* Command Selection */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-3">
                  Select Command
                </label>
                <CustomSelect
                  value={command}
                  options={commands}
                  onChange={setCommand}
                  placeholder="Choose command..."
                  isOpen={isSelectOpen === 'command'}
                  onToggle={() => setIsSelectOpen(isSelectOpen === 'command' ? null : 'command')}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: isValid() ? 1.02 : 1 }}
                  whileTap={{ scale: isValid() ? 0.98 : 1 }}
                  onClick={handleSend}
                  disabled={!isValid() || isLoading}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                    isValid()
                      ? 'bg-[#FFD700] text-black hover:bg-[#FFD700]/90'
                      : 'bg-white/5 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
       {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
    </AnimatePresence>
  );
};

export default CommandPopup;