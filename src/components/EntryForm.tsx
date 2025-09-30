import React, { useEffect } from 'react';
import { Instagram, MessageCircle, Phone } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const EntryForm = () => {
  const { settings } = useSiteSettings();

  useEffect(() => {
    // FormRunのスクリプトを動的に読み込み
    const script = document.createElement('script');
    script.src = 'https://sdk.form.run/js/v2/embed.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // クリーンアップ時にスクリプトを削除
      const existingScript = document.querySelector('script[src="https://sdk.form.run/js/v2/embed.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <>
      {/* エントリーセクション */}
      <section id="entry" className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">エントリー</h2>
            <p className="text-lg text-gray-600">
              REMILA BHC 2026へのエントリーは<br />
              Instagramで簡単にできます
            </p>
          </div>

          {/* エントリー方法 */}
          <div className="flex justify-center">
            <div className="text-center py-8 px-16 bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl max-w-2xl w-full border border-gray-200">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <img 
                  src="/Instagram_logo.png" 
                  alt="Instagram" 
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Instagram でエントリー</h3>
              <p className="text-gray-600 mb-8">
                @remila_bhcをタグ付け＋<br />
                指定ハッシュタグで投稿
              </p>
              <a 
                href={settings?.instagram_url || "https://www.instagram.com/remila_bhc/"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full sm:inline-block sm:w-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-4 px-4 sm:px-12 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg text-center"
              >
                @remila_bhcをフォローしてエントリー
              </a>
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                ご質問・お問い合わせはDMにてお気軽にお問い合わせいただけます。
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default EntryForm;