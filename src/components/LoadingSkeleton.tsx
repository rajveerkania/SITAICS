import React from "react";

interface LoadingProps {
  loadingText: string;
}

const LoadingSkeleton: React.FC<LoadingProps> = ({ loadingText }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-gray border-t-black rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">
        Loading {loadingText}
      </p>
    </div>
  );
};

export default LoadingSkeleton;
