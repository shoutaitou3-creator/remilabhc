import React from 'react';

interface SharedDownloadHeaderProps {
  title?: string;
  description?: string;
  customTheme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
      accent?: string;
    };
    typography?: {
      fontFamily?: string;
    };
  };
}

const SharedDownloadHeader: React.FC<SharedDownloadHeaderProps> = ({
  title = "資料ダウンロード",
  description = "ご利用いただける資料をダウンロードできます",
  customTheme
}) => {
  const themeStyles = {
    color: customTheme?.colors?.text || '#1f2937',
    fontFamily: customTheme?.typography?.fontFamily || 'Noto Sans JP, sans-serif'
  };

  return (
    <div className="text-center mb-8 md:mb-12" style={themeStyles}>
      <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      <p className="text-base md:text-lg text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default SharedDownloadHeader;