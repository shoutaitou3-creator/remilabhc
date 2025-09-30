import React from 'react';

const DownloadHeader: React.FC = () => {
  return (
    <div className="text-center mb-8 md:mb-12">
      <div className="mb-4 md:mb-6">
        <img 
          src="/remila_logo.png" 
          alt="REMILA" 
          className="h-10 md:h-14 w-auto mx-auto"
        />
      </div>
      <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
        ご登録ありがとうございます。<br />
        レミラの資料はこちらからダウンロードできます。
      </h1>
    </div>
  );
};

export default DownloadHeader;