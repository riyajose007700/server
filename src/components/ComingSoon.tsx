import React from 'react';

interface ComingSoonProps {
  pageName: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ pageName }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#FFD700] mb-4">{pageName}</h1>
        <p className="text-xl text-gray-400 mb-8">Coming Soon</p>
        <div className="w-24 h-24 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};