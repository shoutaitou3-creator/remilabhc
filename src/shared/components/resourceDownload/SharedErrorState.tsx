import React from 'react';

interface SharedErrorStateProps {
  error: string;
  customTheme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
      accent?: string;
    };
  };
}

const SharedErrorState: React.FC<SharedErrorStateProps> = ({
  error,
  customTheme
}) => {
  const accentColor = customTheme?.colors?.accent || '#fef2f2';

  return (
    <div 
      className="mb-6 border border-red-200 rounded-lg p-4"
      style={{ backgroundColor: accentColor }}
    >
      <p className="text-red-800">{error}</p>
    </div>
  );
};

export default SharedErrorState;