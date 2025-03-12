import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, User, X, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (await login(username, password)) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-md p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#3A3A3A] to-black rounded-2xl transform rotate-2" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-black rounded-2xl transform -rotate-2" />
            <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl  p-8">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                  className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <User className="w-8 h-8 text-black" />
                </motion.div>
                <h2 className="text-3xl font-bold text-[#FFD700]">Welcome Back</h2>
                <p className="text-white/60 mt-2">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div 
                  className="relative group"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFD700]/60 w-5 h-5 transition-colors group-focus-within:text-[#FFD700]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-[#FFD700]/20 rounded-lg py-3 px-10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/10 transition-all"
                    placeholder="Username"
                  />
                  <div className="absolute inset-0 rounded-lg bg-[#FFD700]/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </motion.div>

                <motion.div 
                  className="relative group"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFD700]/60 w-5 h-5 transition-colors group-focus-within:text-[#FFD700]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-[#FFD700]/20 rounded-lg py-3 px-10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/10 transition-all"
                    placeholder="Password"
                  />
                  <div className="absolute inset-0 rounded-lg bg-[#FFD700]/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </motion.div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-500 text-sm">{error}</p>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-semibold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300 relative group overflow-hidden disabled:opacity-70"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFA500] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};