import React from 'react';
import { Phone, MapPin, Building, Zap } from 'lucide-react';
import { SiteSettings } from '../hooks/useSiteSettings';

interface FooterProps {
  onAdminClick?: () => void;
  siteSettings?: SiteSettings | null;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, siteSettings }) => {
  // URLパラメータからサイトスラッグを取得
  const getSiteSlugFromUrl = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('app') || 'remila-bhc';
  };

  // 管理ページへのリンクを生成
  const getAdminUrl = (): string => {
    const currentSiteSlug = getSiteSlugFromUrl();
    
    // 常に現在のオリジンを使用（開発・本番共通）
    const adminUrl = `${window.location.origin}?app=${currentSiteSlug}`;
    console.log('Footer - 管理URL生成:', {
      currentOrigin: window.location.origin,
      siteSlug: currentSiteSlug,
      generatedUrl: adminUrl,
      environment: import.meta.env.DEV ? '開発' : '本番'
    });
    return adminUrl;
  };

  return (
    <footer className="bg-gray-900 text-white py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="text-right md:text-left">
            <h3 className="text-2xl font-bold mb-6">REMILA BHC 2026</h3>
            <p className="text-gray-400 leading-relaxed">
              業界初のバックスタイルヘアコンテスト<br />
              エントリー受付中！<br />
              あなたの技術で「後ろ姿美」を<br />
              表現してください。
            </p>
          </div>
          
          <div className="text-right md:text-left">
            <h4 className="text-xl font-semibold mb-6">連絡先</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-end md:justify-start">
                <Phone className="w-5 h-5 text-purple-400 mr-3" />
                <span className="text-gray-400">
                  {siteSettings?.contact_phone || '03-6555-3127'}
                </span>
              </div>
              <div className="flex items-center justify-end md:justify-start">
                <MapPin className="w-5 h-5 text-purple-400 mr-3" />
                <span className="text-gray-400">
                  {siteSettings?.contact_address || '150-0031 東京都渋谷区桜丘町9-16 幸ビル301'}
                </span>
              </div>
              <div className="flex items-center justify-end md:justify-start">
                <Building className="w-5 h-5 text-purple-400 mr-3" />
                <span className="text-gray-400">
                  主催：
                  <a 
                    href={siteSettings?.company_url || "https://resusty.co.jp/"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors ml-1 no-underline"
                  >
                    {siteSettings?.company_name || '株式会社リサスティー'}
                  </a>
                </span>
              </div>
              {/* サービスサイトリンク */}
              {siteSettings?.service_name && siteSettings?.service_url && (
                <div className="flex items-center justify-end md:justify-start">
                  <Zap className="w-5 h-5 text-purple-400 mr-3" />
                  <span className="text-gray-400">
                    サービス：
                    <a 
                      href={siteSettings.service_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors ml-1 no-underline"
                    >
                      {siteSettings.service_name}
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right md:text-left">
            <h4 className="text-xl font-semibold mb-6">メニュー</h4>
            <ul className="space-y-3">
              <li><a href="#news" className="text-gray-400 hover:text-white transition-colors">NEWS</a></li>
              <li><a href="#contest-overview" className="text-gray-400 hover:text-white transition-colors">コンテスト概要</a></li>
              <li><a href="#work-examples" className="text-gray-400 hover:text-white transition-colors">作品例</a></li>
              <li><a href="#judges" className="text-gray-400 hover:text-white transition-colors">審査員</a></li>
              <li><a href="#how-to-enter" className="text-gray-400 hover:text-white transition-colors">応募方法</a></li>
              <li><a href="#prizes" className="text-gray-400 hover:text-white transition-colors">賞金・賞品</a></li>
              <li><a href="#sponsors" className="text-gray-400 hover:text-white transition-colors">協賛企業</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#entry" className="text-gray-400 hover:text-white transition-colors">エントリー</a></li>
              <li><a href="/design-spec" className="text-gray-400 hover:text-white transition-colors">デザイン仕様</a></li>
              <li>
                <a 
                  href={`mailto:${siteSettings?.contact_email || 'info@remilabhc.com'}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  お問い合わせ
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500">
            © 2025 {siteSettings?.company_name || 'REMILA Back Style Hair Contest'}. All rights reserved.
          </p>
          {onAdminClick && (
            <div className="mt-4">
              <a
                href="/download"
                className="text-gray-600 hover:text-gray-400 transition-colors text-sm underline mr-4"
              >
                レミラ ご導入検討資料
              </a>
              <a
                href={getAdminUrl()}
                onClick={(e) => {
                  console.log('Footer - 管理者ログインリンククリック');
                  
                  // Bolt環境では特別な処理
                  if (import.meta.env.DEV) {
                    e.preventDefault();
                    const adminUrl = getAdminUrl();
                    console.log('Footer - Bolt環境での管理者ログイン:', {
                      adminUrl,
                      currentUrl: window.location.href,
                      willNavigateTo: adminUrl
                    });
                    
                    // 強制的にページ遷移
                    window.location.replace(adminUrl);
                  }
                }}
                className="text-gray-600 hover:text-gray-400 transition-colors text-sm underline"
              >
                管理者ログイン
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;