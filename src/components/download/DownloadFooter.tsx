import React from 'react';

const DownloadFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold mb-2">REMILAレミラ</h3>
            <p className="text-xs md:text-sm text-gray-400 px-2">
              有名トップスタイリストが多数導入。
            </p>
          </div>
          
          <div className="space-y-1 md:space-y-2 text-gray-400 text-xs md:text-sm">
            <div>
              <a 
                href="https://resusty.co.jp/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors break-words"
              >
                株式会社リサスティー
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-3 md:pt-4 mt-3 md:mt-4">
            <p className="text-gray-500 text-xs md:text-sm">
              © 2025 REMILA BHC. All rights reserved.
            </p>
            <div className="mt-2 md:mt-3">
              <a
                href="/"
                className="text-blue-400 hover:text-blue-300 transition-colors text-xs md:text-sm underline"
              >
                メインサイトに戻る
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DownloadFooter;