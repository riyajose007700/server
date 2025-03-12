import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StatusCardProps {
  title: string;
  count: string | number;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  count, 
  color, 
  icon,
  bgColor
}) => {
  return (
    <div className="bg-gradient-to-br from-[#101010] via-[#1A1A1A] to-[#101010] rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-2xl border border-[#FFD500]/10 hover:border-[#FFD500]/30">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[#FFD500] text-sm font-medium mb-1">{title}</h3>
          <p className="text-5xl font-bold text-white">{count}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor} ${color}`}>
          {icon}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <a href="#" className="text-gray-400 text-xs font-medium flex items-center hover:text-white transition-colors">
          View Details
          <ArrowRight size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
};