import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const stored = sessionStorage.getItem('sidebarOpen');
    return stored ? JSON.parse(stored) : true;
  });

  React.useEffect(() => {
    sessionStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101010] via-[black] to-[#101010]">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <motion.main
          initial={false}
          animate={{ marginLeft: isSidebarOpen ? '280px' : '64px' }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 relative z-0"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};