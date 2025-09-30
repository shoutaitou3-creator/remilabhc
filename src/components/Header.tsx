import React, { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { SiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  onAdminClick?: () => void;
  siteSettings?: SiteSettings | null;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, siteSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // URLパラメータからサイトスラッグを取得
  const getSiteSlugFromUrl = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('app') || 'remila-bhc';
  };

  // 管理ページへのリンクを生成
  const getAdminUrl = (): string => {
    const currentSiteSlug = getSiteSlugFromUrl();
    return `${window.location.origin}?app=${currentSiteSlug}`;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { href: "#news", label: "NEWS" },
    { href: "#contest-overview", label: "概要", fullLabel: "コンテスト概要" },
    { href: "#entry-works", label: "エントリー作品" },
    { href: "#work-examples", label: "作品例" },
    { href: "#judges", label: "審査員" },
    { href: "#how-to-enter", label: "応募方法", fullLabel: "応募方法" },
    { href: "#prizes", label: "賞金賞品", fullLabel: "賞金・賞品" },
    { href: "#sponsors", label: "協賛", fullLabel: "協賛企業" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-1 md:py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 md:h-16">
            <div className="flex items-center">
              <img 
                src="/REMILA_BHC_logo.jpg" 
                alt="REMILA BHC" 
                className="h-7 md:h-12 w-auto"
              />
              {/* エントリー受付中の目立つ表示 */}
              <a 
                href="#entry"
                className="ml-2 sm:ml-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-400 px-2 sm:px-4 py-1 sm:py-2 shadow-lg text-center hover:from-blue-700 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 cursor-pointer leading-tight"
              >
                <span className="block">エントリー</span>
                <span className="block">受付中</span>
              </a>
              {/* メンテナンスモード表示 */}
              {siteSettings?.maintenance_mode && (
                <div className="ml-2 sm:ml-3 text-xs sm:text-sm font-bold text-white bg-red-600 px-2 sm:px-3 py-1 sm:py-2">
                  メンテナンス中
                </div>
              )}
            </div>
            
            {/* デスクトップ版ナビゲーション */}
            <nav className="hidden md:flex space-x-8">
              {menuItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.href} 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* ハンバーガーメニューボタン（スマホ版のみ） */}
            <button
              onClick={toggleMenu}
             className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="メニューを開く"
            >
              {isMenuOpen ? (
               <X className="w-6 h-6" />
              ) : (
               <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* スマホ版ドロップダウンメニュー */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <nav className="px-4 py-2 text-right">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={closeMenu}
                  className="block py-3 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-right"
                >
                  {item.fullLabel || item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* スマホ版でヘッダー固定時のスペーサー */}
      <div className="h-12 md:h-24"></div>
    </>
  );
};

export default Header;