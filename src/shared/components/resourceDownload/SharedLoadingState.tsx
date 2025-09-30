import React from 'react';

interface SharedLoadingStateProps {
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

const SharedLoadingState: React.FC<SharedLoadingStateProps> = ({
  customTheme
}) => {
  const primaryColor = customTheme?.colors?.primary || '#8b5cf6';
  const textColor = customTheme?.colors?.text || '#6b7280';

  return (
    <div className="text-center py-8">
      <div 
        className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
        style={{ borderColor: primaryColor }}
      ></div>
      <p style={{ color: textColor }}>
        資料を読み込み中...
      </p>
    </div>
  );
};

export default SharedLoadingState;