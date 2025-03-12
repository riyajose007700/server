import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-gradient-to-r from-[#1A1A1A] via-[#101010] to-[#1A1A1A] fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/5 text-gray-400 hover:text-gray-200 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Logo Section */}
          <img src="src/images/Logo-Light-1.png" alt="Logo" className="h-12" />
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 text-gray-400 hover:text-gray-200 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="relative" ref={profileRef}>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
              <div className="text-right">
                <p className="text-sm text-gray-300">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
              </div>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 bg-[#252525]/50 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-white/5 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-[#1A1A1A] to-[#252525] rounded-lg shadow-xl py-1 border border-gray-800">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Add settings handler here
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};