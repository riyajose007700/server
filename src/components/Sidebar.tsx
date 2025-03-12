import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Settings,
  Download,
  Terminal,
  CreditCard,
  Users,
  Printer,
  Server,
  Database,
  HardDrive,
  Activity,
  AlertCircle,
  Package,
  FileText,
  DollarSign,
  ShoppingBag,
  Boxes,
  Key,
  ChevronDown,
  MonitorCheck,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: MonitorCheck, label: 'Terminal Monitoring', path: '/terminal-monitoring' },
  { icon: Settings, label: 'ATM Device Configuration', path: '/atm-config' },
  {
    icon: Download,
    label: 'Download Builder',
    path: '/download-builder',
    subItems: [
      { label: 'BIN', path: '/download-builder/bin' },
      { label: 'FI Table', path: '/download-builder/fi-table' },
      { label: 'Options', path: '/download-builder/options' },
      { label: 'Timer', path: '/download-builder/timer' },
      { label: 'States', path: '/download-builder/states' },
      { label: 'Screens', path: '/download-builder/screens' },
      { label: 'Transaction Mapping', path: '/download-builder/transaction-mapping' },
      { label: 'Response Mapping', path: '/download-builder/response-mapping' },
      { label: 'Currencies', path: '/download-builder/currencies' }
    ]
  },
  { icon: Terminal, label: 'Command Center', path: '/command-center' },
  {
    icon: CreditCard,
    label: 'ICC',
    path: '/icc',
    subItems: [
      { label: 'ICC Application', path: '/icc/application' },
      { label: 'ICC Transaction Data', path: '/icc/transaction-data' },
      { label: 'ICC Secondary Application', path: '/icc/secondary-application' },
      { label: 'ICC Language Data', path: '/icc/language-data' }
    ]
  },
  { icon: Users, label: 'ATM Group', path: '/atm-group' },
  { icon: Printer, label: 'ATM Receipt', path: '/atm-receipt' },
  { icon: Settings, label: 'ATM Type Configuration', path: '/atm-type-config' },
  { icon: Server, label: 'Connections', path: '/connections' },
  { icon: Database, label: 'Dispense Table', path: '/dispense-table' },
  { icon: HardDrive, label: 'HSM Devices', path: '/hsm-devices' },
  { icon: Key, label: 'Keys', path: '/keys' },
  { icon: FileText, label: 'EJ', path: '/ej' },
  { icon: Database, label: 'Database', path: '/database' },
  { icon: Settings, label: 'Connection Parameters', path: '/connection-params' },
  { icon: HardDrive, label: 'Hardware Config', path: '/hardware-config' },
  { icon: FileText, label: 'Hardware Config Description', path: '/hardware-config-desc' },
  { icon: Activity, label: 'Sensor Status', path: '/sensor-status' },
  { icon: AlertCircle, label: 'Sensor Status Description', path: '/sensor-status-desc' },
  { icon: Package, label: 'Supplies Status', path: '/supplies-status' },
  { icon: FileText, label: 'Supplies Status Description', path: '/supplies-status-desc' },
  { icon: FileText, label: 'Transaction Details', path: '/transaction-details' },
  { icon: DollarSign, label: 'BNA Counter', path: '/bna-counter' },
  { icon: ShoppingBag, label: 'BNA Note Definition', path: '/bna-note-def' },
  { icon: DollarSign, label: 'Currency Code', path: '/currency-code' },
  { icon: Settings, label: 'Media Config', path: '/media-config' },
  { icon: ShoppingBag, label: 'POS Data Code', path: '/pos-data-code' },
  { icon: Boxes, label: 'Device Failure Category', path: '/device-failure' },
  { icon: Search, label: 'Trace Viewer', path: '/trace-viewer' }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = React.useState<string | null>(() => {
    const stored = sessionStorage.getItem('sidebarExpanded');
    return stored ? JSON.parse(stored) : null;
  });
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState<number | null>(null);

  React.useEffect(() => {
    sessionStorage.setItem('sidebarExpanded', JSON.stringify(expandedItem));
  }, [expandedItem]);

  React.useEffect(() => {
    const currentMenuItem = menuItems.find(item => 
      item.path === location.pathname || 
      item.subItems?.some(sub => sub.path === location.pathname)
    );
    if (currentMenuItem?.subItems) {
      setExpandedItem(currentMenuItem.label);
    }
  }, [location.pathname]);

  const handleItemHover = (label: string, element: HTMLElement | null) => {
    setHoveredItem(label);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTooltipPosition(rect.top);
    }
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 64
        }}
        className="fixed left-0 top-16 bottom-0 bg-gradient-to-br from-[#101010] via-[#1A1A1A] to-[#101010] z-20 flex flex-col shadow-xl"
      >
        {/* Scrollable navigation content */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.subItems?.some(sub => location.pathname === sub.path));
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedItem === item.label;
            
            return (
              <div key={item.path} className="relative mb-1">
                <div 
                  className="group"
                  onMouseEnter={(e) => handleItemHover(item.label, e.currentTarget)}
                  onMouseLeave={() => {
                    setHoveredItem(null);
                    setTooltipPosition(null);
                  }}
                >
                  <Link
                    to={hasSubItems ? '#' : item.path}
                    onClick={(e) => {
                      if (hasSubItems) {
                        e.preventDefault();
                        if (!isOpen) {
                          onToggle();
                          setExpandedItem(item.label);
                        } else {
                          setExpandedItem(isExpanded ? null : item.label);
                        }
                      }
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FFD700]/10 to-transparent text-[#FFD700]'
                        : 'text-gray-400 hover:bg-[#FFD700]/5 hover:text-[#FFD700]'
                    }`}
                  >
                    <Icon className="w-5 h-5 min-w-[20px]" />
                    <span className={`text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      !isOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                    }`}>
                      {item.label}
                    </span>
                    {hasSubItems && isOpen && (
                      <motion.div
                        initial={false}
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-auto"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-indicator"
                        className="absolute right-0 w-1 h-8 bg-[#FFD700] rounded-l-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </div>
                <AnimatePresence>
                  {hasSubItems && isExpanded && isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1 space-y-1 ml-6"
                    >
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            location.pathname === subItem.path
                              ? 'text-[#FFD700] bg-gradient-to-r from-[#FFD700]/10 to-transparent'
                              : 'text-gray-400 hover:text-[#FFD700] hover:bg-[#FFD700]/5'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Fixed footer with collapse button */}
        <div className="sticky bottom-0 p-4 border-t border-[#FFD700]/10 bg-[#101010] z-30">
          {isOpen && (
            <button
              onClick={onToggle}
              className="w-full px-3 py-1.5 rounded-md bg-[#1A1A1A] border border-[#FFD700]/10 text-sm text-gray-400 hover:text-[#FFD700] transition-colors flex items-center justify-between"
            >
              <span>Collapse Menu</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.aside>
      
      {/* Tooltip container */}
      <div className="fixed left-0 top-0 z-[9999] pointer-events-none">
        {!isOpen && hoveredItem && tooltipPosition !== null && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 72 }}
            exit={{ opacity: 0, x: 40 }}
            className="fixed bg-[#1A1A1A] text-gray-300 text-sm rounded-md shadow-lg whitespace-nowrap border border-[#FFD700]/10 backdrop-blur-sm px-3 py-2 pointer-events-auto"
            style={{
              top: tooltipPosition,
              transform: 'translateY(-50%)'
            }}
          >
            {hoveredItem}
          </motion.div>
        )}
      </div>
    </>
  );
};