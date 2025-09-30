import React, { useState, useEffect } from 'react';
import { Image, Upload, Trash2 } from 'lucide-react';
import { SiteSettings } from '../../../../hooks/useSiteSettings';
import { uploadImage, deleteImage, extractPathFromUrl } from '../../../../lib/supabase';

interface BasicSettingsSectionProps {
  formData: SiteSettings;
  onInputChange: (field: keyof SiteSettings, value: string | boolean) => void;
}

const BasicSettingsSection: React.FC<BasicSettingsSectionProps> = ({
  formData,
  onInputChange
}) => {
  const [selectedFaviconFile, setSelectedFaviconFile] = useState<File | null>(null);
  const [faviconPreviewUrl, setFaviconPreviewUrl] = useState<string>('');
  const [isFaviconUploading, setIsFaviconUploading] = useState(false);
  const [faviconUploadError, setFaviconUploadError] = useState<string>('');

  // ファビコンファイル選択ハンドラ
  const handleFaviconFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFaviconFile(file);
      const url = URL.createObjectURL(file);
      setFaviconPreviewUrl(url);
    }
  };

  // ファビコンSupabaseアップロードハンドラ
  const handleFaviconUploadToSupabase = async () => {
    if (selectedFaviconFile) {
      setIsFaviconUploading(true);
      setFaviconUploadError('');
      
      try {
        console.log('ファビコンアップロード開始:', selectedFaviconFile.name);

        // 古いファビコンがある場合は削除
        if (formData.favicon) {
          console.log('古いファビコンを削除中:', formData.favicon);
          const oldPath = extractPathFromUrl(formData.favicon, 'site-settings-images');
          if (oldPath) {
            const deleteResult = await deleteImage('site-settings-images', oldPath);
            console.log('古いファビコン削除結果:', deleteResult);
          }
        }

        // ユニークなファイル名を生成
        const fileExtension = selectedFaviconFile.name.split('.').pop();
        const fileName = `favicon-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filePath = `favicons/${fileName}`;

        console.log('新しいファビコンをアップロード中:', filePath);

        // Supabaseにアップロード
        const { url, error } = await uploadImage(selectedFaviconFile, 'site-settings-images', filePath);
        
        if (error) {
          console.error('ファビコンアップロードエラー:', error);
          setFaviconUploadError(`アップロードに失敗しました: ${error}`);
          return;
        }

        if (!url) {
          console.error('ファビコンURLが取得できませんでした');
          setFaviconUploadError('アップロードに失敗しました: URLが取得できませんでした');
          return;
        }
        
        console.log('ファビコンアップロード成功、新しいURL:', url);

        // キャッシュバスティング用のクエリパラメータを追加
        const urlWithCacheBuster = `${url}?v=${Date.now()}`;
        console.log('キャッシュバスティング付きURL:', urlWithCacheBuster);

        // フォームのファビコンURLを更新
        onInputChange('favicon', urlWithCacheBuster);
        
        // ブラウザのファビコンを即座に更新
        updateBrowserFavicon(urlWithCacheBuster);
        
        setSelectedFaviconFile(null);
        setFaviconPreviewUrl('');
        
        // ファイル入力をリセット
        const fileInput = document.getElementById('favicon-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setFaviconUploadError('');
        console.log('ファビコンアップロード完了');
        
        // 成功メッセージを表示
        alert('ファビコンのアップロードが完了しました。設定を保存してください。');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('ファビコンアップロード処理エラー:', errorMessage);
        setFaviconUploadError(`アップロードに失敗しました: ${errorMessage}`);
      } finally {
        setIsFaviconUploading(false);
      }
    }
  };

  // ブラウザのファビコンを即座に更新する関数
  const updateBrowserFavicon = (newFaviconUrl: string) => {
    try {
      // 既存のファビコンリンクを取得または作成
      let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        document.head.appendChild(faviconLink);
      }
      
      // 新しいファビコンURLを設定
      faviconLink.href = newFaviconUrl;
      
      // 強制的にブラウザに再読み込みさせる
      const tempLink = faviconLink.cloneNode(true) as HTMLLinkElement;
      document.head.removeChild(faviconLink);
      document.head.appendChild(tempLink);
      
      console.log('ブラウザファビコンを更新しました:', newFaviconUrl);
    } catch (error) {
      console.warn('ブラウザファビコンの更新に失敗:', error);
    }
  };

  // ファビコン画像削除ハンドラ
  const handleDeleteFavicon = async () => {
    // Supabaseからファビコンを削除
    if (formData.favicon) {
      const imagePath = extractPathFromUrl(formData.favicon, 'site-settings-images');
      if (imagePath) {
        const { success, error } = await deleteImage('site-settings-images', imagePath);
        if (!success && error) {
          console.warn('ファビコンの削除に失敗しました:', error);
        }
      }
    }

    onInputChange('favicon', '');
    
    // ブラウザのファビコンもリセット
    updateBrowserFavicon('/REMILA_BHC_logo2.jpg'); // デフォルトファビコンに戻す
    
    setSelectedFaviconFile(null);
    setFaviconPreviewUrl('');
    
    // ファイル入力をリセット
    const fileInput = document.getElementById('favicon-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // クリーンアップ処理
  useEffect(() => {
    return () => {
      if (faviconPreviewUrl) {
        URL.revokeObjectURL(faviconPreviewUrl);
      }
    };
  }, [faviconPreviewUrl]);
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          サイト識別子 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.site_slug}
          onChange={(e) => onInputChange('site_slug', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px] font-mono"
          placeholder="remila-bhc"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          このサイトを識別するためのユニークなスラッグ（英数字とハイフンのみ）
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          サイトタイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.site_title}
          onChange={(e) => onInputChange('site_title', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
          placeholder="サイトのタイトルを入力"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          サイト説明 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.site_description}
          onChange={(e) => onInputChange('site_description', e.target.value)}
          rows={3}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base resize-none"
          placeholder="サイトの説明を入力"
          required
        />
        <div className="mt-2 text-sm text-gray-500">
          文字数: {formData.site_description.length}文字
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          キーワード
        </label>
        <input
          type="text"
          value={formData.site_keywords}
          onChange={(e) => onInputChange('site_keywords', e.target.value)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
          placeholder="キーワードをカンマ区切りで入力"
        />
        <p className="text-xs text-gray-500 mt-1">
          例: ヘアコンテスト,美容師,理容師,バックスタイル
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ファビコン
        </label>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
          {/* ファビコンプレビュー */}
          <div className="mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white mx-auto">
              {faviconPreviewUrl || formData.favicon ? (
                <img
                  src={faviconPreviewUrl || formData.favicon}
                  alt="ファビコンプレビュー"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <Image className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 text-gray-400" />
                  <span className="text-xs text-gray-500">ファビコンなし</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {/* ファイル選択 */}
            <div>
              <input
                id="favicon-file-input"
                type="file"
                accept="image/*"
                onChange={handleFaviconFileSelect}
                className="hidden"
              />
              <label
                htmlFor="favicon-file-input"
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors cursor-pointer text-sm w-full min-h-[44px]"
              >
                <Upload className="w-4 h-4" />
                <span>ファイル選択</span>
              </label>
            </div>

            {/* 選択されたファイル名表示 */}
            {selectedFaviconFile && (
              <div className="text-sm text-green-600 text-center">
                選択中: {selectedFaviconFile.name}
              </div>
            )}

            {/* アップロードエラー表示 */}
            {faviconUploadError && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                {faviconUploadError}
              </div>
            )}

            {/* アップロードボタン */}
            <button
              onClick={handleFaviconUploadToSupabase}
              disabled={!selectedFaviconFile || isFaviconUploading}
              type="button"
              className={`flex items-center justify-center space-x-2 text-white px-4 py-3 rounded-lg transition-colors text-sm disabled:cursor-not-allowed w-full min-h-[44px] ${
                formData.favicon && !selectedFaviconFile 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
              }`}
            >
              {isFaviconUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>アップロード中...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>
                    {formData.favicon && !selectedFaviconFile ? 'ファビコンを更新' : 'Supabaseにアップロード'}
                  </span>
                </>
              )}
            </button>

            {/* 削除ボタン */}
            <button
              onClick={handleDeleteFavicon}
              disabled={!formData.favicon}
              type="button"
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors text-sm w-full disabled:cursor-not-allowed min-h-[44px]"
            >
              <div className="flex items-center justify-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>ファビコンを削除</span>
              </div>
            </button>
          </div>

          {/* 手動URL入力 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              または、URLを直接入力
            </label>
            <input
              type="text"
              value={formData.favicon}
              onChange={(e) => onInputChange('favicon', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
              placeholder="/favicon.ico"
            />
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
              ファビコンのパスまたはURLを入力
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicSettingsSection;