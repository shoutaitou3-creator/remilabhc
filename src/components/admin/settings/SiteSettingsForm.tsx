import React, { useState, useEffect } from 'react';
import { X, Globe, Search, Image, FileText, Phone, Save } from 'lucide-react';
import { useSiteSettings, SiteSettings } from '../../../hooks/useSiteSettings';
import BasicSettingsSection from './siteSettings/BasicSettingsSection';
import SeoSettingsSection from './siteSettings/SeoSettingsSection';
import ContactSettingsSection from './siteSettings/ContactSettingsSection';
import SocialSettingsSection from './siteSettings/SocialSettingsSection';
import ColorSettingsSection from './siteSettings/ColorSettingsSection';
import AdvancedSettingsSection from './siteSettings/AdvancedSettingsSection';

interface SiteSettingsFormProps {
  onClose: () => void;
}

const SiteSettingsForm: React.FC<SiteSettingsFormProps> = ({ onClose }) => {
  const { settings, loading, error, saveSettings } = useSiteSettings();
  const [formData, setFormData] = useState<SiteSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');
  const [activeSection, setActiveSection] = useState('basic');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 設定データが読み込まれたらフォームデータを初期化
  useEffect(() => {
    if (settings) {
      setFormData({
        site_title: settings.site_title,
        site_description: settings.site_description,
        site_keywords: settings.site_keywords,
        meta_title: settings.meta_title,
        meta_description: settings.meta_description,
        og_title: settings.og_title,
        og_description: settings.og_description,
        og_image: settings.og_image,
        contact_phone: settings.contact_phone,
        contact_email: settings.contact_email,
        contact_address: settings.contact_address,
        company_name: settings.company_name,
        company_url: settings.company_url,
        service_name: settings.service_name || '',
        service_url: settings.service_url || '',
        instagram_url: settings.instagram_url,
        twitter_url: settings.twitter_url,
        facebook_url: settings.facebook_url,
        youtube_url: settings.youtube_url,
        maintenance_mode: settings.maintenance_mode,
        analytics_id: settings.analytics_id,
        favicon: settings.favicon,
        meta_pixel_id: settings.meta_pixel_id,
        animation_duration: settings.animation_duration
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      handleSave();
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    // 「色・デザイン設定」タブがアクティブな場合は、メインフォームの保存処理をスキップ
    // 色設定は独自の保存ボタンで管理されるため
    if (activeSection === 'colors') {
      console.log("Color settings are managed by their own save buttons.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError('');

      console.log('サイト設定保存開始:', {
        favicon: formData.favicon,
        site_title: formData.site_title,
        meta_title: formData.meta_title
      });

      const result = await saveSettings(formData);
      
      if (result.success) {
        console.log('サイト設定保存成功');
        alert('サイト設定を保存しました');
        onClose();
      } else {
        console.error('サイト設定保存失敗:', result.error);
        setSaveError(result.error || '保存に失敗しました');
      }
    } catch (err) {
      console.error('サイト設定保存エラー:', err);
      setSaveError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof SiteSettings, value: string | boolean | number) => {
    if (formData) {
      setFormData(prev => prev ? ({
        ...prev,
        [field]: value
      }) : null);
    }
  };

  // ローディング中の表示
  if (loading || !formData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">設定を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'basic', label: '基本情報', icon: <Globe className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO・メタデータ', icon: <Search className="w-4 h-4" /> },
    { id: 'contact', label: '連絡先情報', icon: <Phone className="w-4 h-4" /> },
    { id: 'social', label: 'ソーシャルメディア', icon: <Image className="w-4 h-4" /> },
    { id: 'colors', label: '色・デザイン設定', icon: <FileText className="w-4 h-4" /> },
    { id: 'advanced', label: 'アナリティクス・システム', icon: <FileText className="w-4 h-4" /> }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'basic':
        return <BasicSettingsSection formData={formData} onInputChange={handleInputChange} />;
      case 'seo':
        return <SeoSettingsSection formData={formData} onInputChange={handleInputChange} />;
      case 'contact':
        return <ContactSettingsSection formData={formData} onInputChange={handleInputChange} />;
      case 'social':
        return <SocialSettingsSection formData={formData} onInputChange={handleInputChange} />;
      case 'colors':
        return <ColorSettingsSection formData={formData} onInputChange={handleInputChange} />;
      case 'advanced':
        return <AdvancedSettingsSection formData={formData} onInputChange={handleInputChange} />;
      default:
        return <BasicSettingsSection formData={formData} onInputChange={handleInputChange} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">サイト設定</h2>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">メタデータ・SEO・連絡先情報の管理</p>
            </div>
          </div>
          
          {/* モバイル用メニューボタン */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="メニューを開く"
            >
              <div className="w-4 h-4 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
              </div>
            </button>
            
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {/* モバイル用オーバーレイ */}
          {isMobileSidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-10"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
          
          {/* サイドバー */}
          <div className={`
            fixed lg:static lg:translate-x-0 top-0 left-0 z-20
            w-64 sm:w-72 lg:w-64 bg-gray-50 border-r border-gray-200 
            h-full lg:h-auto overflow-y-auto
            transform transition-transform duration-300 ease-in-out
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:block
          `}>
            <div className="p-3 sm:p-4">
              {/* モバイル用ヘッダー */}
              <div className="lg:hidden mb-4 pb-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">設定メニュー</h3>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-3 rounded-lg text-left transition-colors min-h-[44px] ${
                    activeSection === section.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.icon}
                  <span className="text-sm sm:text-base font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1 overflow-y-auto lg:ml-0">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {sections.find(s => s.id === activeSection)?.label}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {activeSection === 'basic' && 'サイトの基本情報を設定します'}
                  {activeSection === 'seo' && 'SEO・メタデータ・SNSシェア用の設定を行います'}
                  {activeSection === 'contact' && '連絡先情報・会社情報・サービスサイトリンクを設定します'}
                  {activeSection === 'social' && 'ソーシャルメディアのURLを設定します'}
                  {activeSection === 'colors' && 'サイト全体の色合い・デザインテーマ・アニメーション設定を管理します'}
                  {activeSection === 'advanced' && 'Google Analytics・Metaピクセル・メンテナンスモードなどのシステム管理設定'}
                </p>
              </div>

              {renderSectionContent()}

              {/* フォームアクション */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                {/* エラー表示 */}
                {(error || saveError) && (
                  <div className="w-full mb-4 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                    <p className="text-red-800 text-sm">{error || saveError}</p>
                  </div>
                )}

                {/* 色・デザイン設定以外の場合のみ保存ボタンを表示 */}
                {activeSection !== 'colors' && (
                  <>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSaving}
                      className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-h-[44px] text-sm sm:text-base"
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 sm:px-6 py-3 rounded-lg transition-colors font-medium disabled:cursor-not-allowed min-h-[44px] text-sm sm:text-base"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>保存中...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>設定を保存</span>
                        </>
                      )}
                    </button>
                  </>
                )}
                
                {/* 色・デザイン設定の場合は閉じるボタンのみ */}
                {activeSection === 'colors' && ( // activeSectionが'colors'の場合のみ表示
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium min-h-[44px] text-sm sm:text-base"
                  >
                    閉じる
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsForm;