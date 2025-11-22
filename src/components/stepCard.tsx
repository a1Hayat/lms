import React from 'react';

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, description, isLast = false }) => {
  return (
    <div className="relative flex items-start py-6">
      <div className="flex flex-col items-center mr-6">
        {/* The Icon Container */}
        <div className="w-10 h-10 flex items-center justify-center bg-transparent text-blue-500">
          {icon}
        </div>
        {/* The Dashed Line Connector (only visible for non-last steps) */}
        {!isLast && (
          <div className="h-full w-0.5 bg-gray-700 border-l border-dashed border-gray-600"></div>
        )}
      </div>

      {/* The Step Content */}
      <div className="flex-1 pt-2">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default StepCard;