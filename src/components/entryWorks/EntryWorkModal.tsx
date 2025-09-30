import React from 'react';
import { useEffect, useRef } from 'react';
import { X, Instagram, ExternalLink, Trophy, Calendar, Tag } from 'lucide-react';

interface EntryWork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  instagram_url: string;
  instagram_account: string;
  department: 'creative' | 'reality';
  hashtag: string;
  period: string;
  is_nominated: boolean;
  created_at: string;
}

interface EntryWorkModalProps {
  work: EntryWork | null;
  isOpen: boolean;
  onClose: () => void;
}

const EntryWorkModal: React.FC<EntryWorkModalProps> = ({ work, isOpen, onClose }) => {
  const instagramContainerRef = useRef<HTMLDivElement>(null);

  // モーダル背景クリックでも閉じる
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESCキーで閉じる
  React.useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Instagram埋め込み投稿のIDを抽出する関数
  const extractInstagramPostId = (url: string): string | null => {
    try {
      const match = url.match(/\/p\/([A-Za-z0-9_-]+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  // 簡素化されたInstagram埋め込みコードを生成する関数
  const generateInstagramEmbed = (postId: string): string => {
    const embedUrl = `https://www.instagram.com/p/${postId}/embed/`;
    
    return `
      <blockquote 
        class="instagram-media" 
        data-instgrm-permalink="https://www.instagram.com/p/${postId}/"
        data-instgrm-version="14"
        style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
        <div style="padding:16px;">
          <a href="https://www.instagram.com/p/${postId}/" target="_blank" style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;">
            <div style="display: flex; flex-direction: row; align-items: center;">
              <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div>
              <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;">
                <div style="background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div>
                <div style="background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div>
              </div>
            </div>
            <div style="padding: 19% 0;"></div>
            <div style="color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px; padding-top: 8px;">
              この投稿をInstagramで見る
            </div>
          </a>
        </div>
      </blockquote>
    `;
  };

  // フォールバックコンテンツを表示する関数
  const showFallbackContent = () => {
    if (!instagramContainerRef.current) return;
    
    instagramContainerRef.current.innerHTML = `
      <div class="flex items-center justify-center w-full h-96 bg-gray-100 rounded-lg">
        <div class="text-center">
          <p class="text-gray-600 mb-4">Instagram投稿の読み込みに失敗しました</p>
          <a href="${work.instagram_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-full">
            <span>Instagramで直接見る</span>
          </a>
        </div>
      </div>
    `;
  };

  // Instagram埋め込みスクリプトをロードし、投稿を表示する関数
  const loadInstagramEmbed = async () => {
    if (!work.instagram_url || !instagramContainerRef.current) return;

    const postId = extractInstagramPostId(work.instagram_url);
    if (!postId) {
      console.warn('Instagram投稿IDを抽出できませんでした:', work.instagram_url);
      showFallbackContent();
      return;
    }

    try {
      console.log('Instagram埋め込み開始:', { postId, url: work.instagram_url });
      
      // 初期ローディング表示
      instagramContainerRef.current.innerHTML = `
        <div class="flex items-center justify-center w-full h-96 bg-gray-100 rounded-lg">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Instagram投稿を読み込み中...</p>
          </div>
        </div>
      `;

      // 少し遅延してから埋め込みコードを挿入
      setTimeout(() => {
        if (!instagramContainerRef.current) return;

        // 簡素化されたInstagram埋め込みコードを生成して挿入
        const embedCode = generateInstagramEmbed(postId);
        instagramContainerRef.current.innerHTML = embedCode;

        // Instagram埋め込みスクリプトをロード
        const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
        if (!existingScript) {
          console.log('Instagram埋め込みスクリプトをロード中...');
          const script = document.createElement('script');
          script.async = true;
          script.src = '//www.instagram.com/embed.js';
          script.onload = () => {
            console.log('Instagram埋め込みスクリプトロード完了');
            // スクリプトロード後に遅延してから処理
            setTimeout(() => {
              try {
                if (window.instgrm && window.instgrm.Embeds) {
                  console.log('Instagram埋め込み処理実行');
                  window.instgrm.Embeds.process();
                } else {
                  console.warn('Instagram埋め込みオブジェクトが利用できません');
                  showFallbackContent();
                }
              } catch (error) {
                console.error('Instagram埋め込み処理エラー:', error);
                showFallbackContent();
              }
            }, 1000);
          };
          script.onerror = () => {
            console.error('Instagram埋め込みスクリプトの読み込みに失敗');
            showFallbackContent();
          };
          document.head.appendChild(script);
        } else {
          console.log('Instagram埋め込みスクリプトは既にロード済み');
          // スクリプトが既にロードされている場合は遅延してから処理
          setTimeout(() => {
            try {
              if (window.instgrm && window.instgrm.Embeds) {
                console.log('既存スクリプトでInstagram埋め込み処理実行');
                window.instgrm.Embeds.process();
              } else {
                console.warn('Instagram埋め込みオブジェクトが利用できません（既存スクリプト）');
                showFallbackContent();
              }
            } catch (error) {
              console.error('Instagram埋め込み処理エラー（既存スクリプト）:', error);
              showFallbackContent();
            }
          }, 800);
        }
      }, 200);

    } catch (error) {
      console.error('Instagram埋め込み処理エラー:', error);
      showFallbackContent();
    }
  };

  // モーダルが開かれた際にInstagram埋め込みを読み込み
  useEffect(() => {
    if (isOpen && work) {
      // モーダルのアニメーションが完了してからロード
      const timer = setTimeout(() => {
        loadInstagramEmbed();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, work]);

  // モーダルが閉じられる際のクリーンアップ
  useEffect(() => {
    if (!isOpen && instagramContainerRef.current) {
      instagramContainerRef.current.innerHTML = '';
    }
  }, [isOpen]);

  if (!isOpen || !work) return null;

  const departmentLabel = work.department === 'creative' ? 'クリエイティブ部門' : 'リアリティー部門';
  const departmentColor = work.department === 'creative' ? 'bg-blue-500' : 'bg-orange-500';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="閉じる"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* 作品画像 */}
          <div className="aspect-[9/16] max-w-md mx-auto overflow-hidden rounded-t-2xl">
            <img
              src={work.image_url}
              alt={work.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/3992883/pexels-photo-3992883.jpeg?auto=compress&cs=tinysrgb&w=400';
              }}
            />
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-6 sm:p-8">
          {/* 基本情報 */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className={`px-3 py-1 ${departmentColor} text-white text-sm font-medium rounded-full`}>
                {departmentLabel}
              </span>
              {work.is_nominated && (
                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold rounded-full shadow-lg">
                  <Trophy className="w-4 h-4" />
                  <span>ノミネート</span>
                </span>
              )}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {work.title}
            </h2>
            
            {/* Instagram情報 */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <a
                href={work.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-full"
              >
                <Instagram className="w-5 h-5" />
                <span className="font-medium">{work.instagram_account}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* メタ情報 */}
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>{work.hashtag}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{work.period}</span>
              </div>
            </div>
          </div>

          {/* 作品説明 */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">作品説明</h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {work.description}
            </div>
          </div>

          {/* Instagram埋め込み投稿 */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl border border-pink-200 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Instagram className="w-5 h-5 text-pink-600" />
              <span>Instagram投稿</span>
            </h3>
            
            <a
              href={work.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors bg-white hover:bg-pink-50 px-6 py-3 rounded-lg border border-pink-200 shadow-sm"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="font-medium">この投稿をInstagramで見る</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EntryWorkModal);