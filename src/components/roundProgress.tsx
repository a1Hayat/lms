import React from "react";

interface RoundProgressProps {
  progress: number; // 0–100
  size?: number; // circle size
  strokeWidth?: number; // circle thickness
  color?: string; // custom color (Tailwind or HEX)
  autoColor?: boolean; // enable auto color based on progress
}

const RoundProgress: React.FC<RoundProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 8,
  color = "text-blue-500",
  autoColor = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // Auto color logic based on progress %
  const getAutoColor = () => {
    if (!autoColor) return color;
    if (progress < 40) return "text-red-500";
    if (progress < 75) return "text-yellow-500";
    return "text-green-500";
  };

  const finalColor = getAutoColor();

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-gray-300 dark:text-gray-700"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className={`${finalColor} transition-all duration-500 ease-out`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Label */}
      <span className="absolute text-sm font-semibold">
        {Math.round(progress)}%
      </span>
    </div>
  );
};

export default RoundProgress;
