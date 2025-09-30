import React, { useState, useEffect } from 'react';
import { Palette, Type, LayoutGrid as Layout, Zap, Monitor, Smartphone, Tablet, Eye, Code, Download, Copy, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface ThemeSettings {
  id: string;
  theme_name: string;
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryHover: string;
    secondaryLight: string;
    secondaryDark: string;
    bgPrimary: string;
    bgSecondary: string;
    bgAccent: string;
    bgDark: string;
    textPrimary: string;
    textSecondary: string;
    textAccent: string;
    textLight: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  typography: {
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
  layout: {
    shadows: string;
    spacing: string;
    borderRadius: string;
    containerWidth: string;
  };
  animations: {
    easing: string;
    duration: number;
    hoverEffects: boolean;
    reducedMotion: boolean;
  };
  is_active: boolean;
}

const DesignSpecificationPage = () => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string>('');
  const { settings: siteSettings } = useSiteSettings();

  // テーマ設定を取得
  const fetchThemeSettings = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('テーマ設定取得エラー:', error);
        setError(`テーマ設定の取得に失敗しました: ${error.message}`);
      } else if (!data) {
        // アクティブなテーマが見つからない場合はデフォルトテーマを使用
        setThemeSettings({
          id: 'default',
          theme_name: 'デフォルトテーマ',
          colors: {
            primary: '#8b5cf6',
            primaryHover: '#7c3aed',
            primaryLight: '#a78bfa',
            primaryDark: '#6d28d9',
            secondary: '#ec4899',
            secondaryHover: '#db2777',
            secondaryLight: '#f472b6',
            secondaryDark: '#be185d',
            bgPrimary: '#ffffff',
            bgSecondary: '#f8fafc',
            bgAccent: '#f1f5f9',
            bgDark: '#1e293b',
            textPrimary: '#1f2937',
            textSecondary: '#6b7280',
            textAccent: '#8b5cf6',
            textLight: '#9ca3af',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
          },
          typography: {
            fontSize: 'base',
            fontFamily: 'Noto Sans JP',
            fontWeight: 'normal',
            lineHeight: 'relaxed',
            letterSpacing: 'normal'
          },
          layout: {
            shadows: 'normal',
            spacing: 'normal',
            borderRadius: 'normal',
            containerWidth: 'standard'
          },
          animations: {
            easing: 'ease-out',
            duration: siteSettings?.animation_duration || 560,
            hoverEffects: true,
            reducedMotion: false
          },
          is_active: true
        });
      } else {
        setThemeSettings(data);
      }
    } catch (err) {
      console.error('テーマ設定取得処理エラー:', err);
      setError(`テーマ設定の取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemeSettings();
  }, [siteSettings]);

  // CSS変数を生成
  const generateCSSVariables = () => {
    if (!themeSettings) return '';

    const cssVars = Object.entries(themeSettings.colors)
      .map(([key, value]) => `  --color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
      .join('\n');

    return `:root {
${cssVars}
  --font-family: '${themeSettings.typography.fontFamily}', sans-serif;
  --font-size-base: ${themeSettings.typography.fontSize === 'base' ? '1rem' : themeSettings.typography.fontSize};
  --line-height: ${themeSettings.typography.lineHeight === 'relaxed' ? '1.625' : themeSettings.typography.lineHeight};
  --animation-duration: ${themeSettings.animations.duration}ms;
  --animation-easing: ${themeSettings.animations.easing};
}`;
  };

  // Tailwind設定を生成
  const generateTailwindConfig = () => {
    if (!themeSettings) return '';

    return `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${themeSettings.colors.primary}',
          hover: '${themeSettings.colors.primaryHover}',
          light: '${themeSettings.colors.primaryLight}',
          dark: '${themeSettings.colors.primaryDark}',
        },
        secondary: {
          DEFAULT: '${themeSettings.colors.secondary}',
          hover: '${themeSettings.colors.secondaryHover}',
          light: '${themeSettings.colors.secondaryLight}',
          dark: '${themeSettings.colors.secondaryDark}',
        }
      },
      fontFamily: {
        sans: ['${themeSettings.typography.fontFamily}', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn ${themeSettings.animations.duration}ms ${themeSettings.animations.easing}',
      }
    }
  }
}`;
  };

  // コードをクリップボードにコピー
  const copyToClipboard = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  const sections = [
    { id: 'overview', label: '概要', icon: <Eye className="w-4 h-4" /> },
    { id: 'colors', label: 'カラーパレット', icon: <Palette className="w-4 h-4" /> },
    { id: 'typography', label: 'タイポグラフィ', icon: <Type className="w-4 h-4" /> },
    { id: 'layout', label: 'レイアウト', icon: <Layout className="w-4 h-4" /> },
    { id: 'animations', label: 'アニメーション', icon: <Zap className="w-4 h-4" /> },
    { id: 'code', label: 'コード出力', icon: <Code className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">デザイン仕様を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  const renderSectionContent = () => {
    if (!themeSettings) return null;

    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">デザインシステム概要</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">基本方針</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• モダンで洗練されたデザイン</li>
                    <li>• レスポンシブ対応（モバイルファースト）</li>
                    <li>• アクセシビリティを重視</li>
                    <li>• 一貫性のあるユーザー体験</li>
                    <li>• 高いパフォーマンス</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">技術スタック</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• React + TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Lucide React (アイコン)</li>
                    <li>• Supabase (データベース)</li>
                    <li>• Vite (ビルドツール)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">現在のテーマ設定</h2>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{themeSettings.theme_name}</h3>
                <div className="grid md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{Object.keys(themeSettings.colors).length}</div>
                    <div className="text-sm text-gray-600">カラー定義</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{themeSettings.typography.fontFamily}</div>
                    <div className="text-sm text-gray-600">フォントファミリー</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{themeSettings.animations.duration}ms</div>
                    <div className="text-sm text-gray-600">アニメーション時間</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{themeSettings.layout.spacing}</div>
                    <div className="text-sm text-gray-600">スペーシング</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'colors':
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">カラーパレット</h2>
              
              {/* プライマリカラー */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">プライマリカラー</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'primary', label: 'Primary', value: themeSettings.colors.primary },
                    { key: 'primaryHover', label: 'Primary Hover', value: themeSettings.colors.primaryHover },
                    { key: 'primaryLight', label: 'Primary Light', value: themeSettings.colors.primaryLight },
                    { key: 'primaryDark', label: 'Primary Dark', value: themeSettings.colors.primaryDark }
                  ].map((color) => (
                    <div key={color.key} className="text-center">
                      <div 
                        className="w-full h-20 rounded-lg border border-gray-200 mb-2"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <div className="text-sm font-medium text-gray-900">{color.label}</div>
                      <div className="text-xs text-gray-500 font-mono">{color.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* セカンダリカラー */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">セカンダリカラー</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'secondary', label: 'Secondary', value: themeSettings.colors.secondary },
                    { key: 'secondaryHover', label: 'Secondary Hover', value: themeSettings.colors.secondaryHover },
                    { key: 'secondaryLight', label: 'Secondary Light', value: themeSettings.colors.secondaryLight },
                    { key: 'secondaryDark', label: 'Secondary Dark', value: themeSettings.colors.secondaryDark }
                  ].map((color) => (
                    <div key={color.key} className="text-center">
                      <div 
                        className="w-full h-20 rounded-lg border border-gray-200 mb-2"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <div className="text-sm font-medium text-gray-900">{color.label}</div>
                      <div className="text-xs text-gray-500 font-mono">{color.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 背景色 */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">背景色</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'bgPrimary', label: 'Background Primary', value: themeSettings.colors.bgPrimary },
                    { key: 'bgSecondary', label: 'Background Secondary', value: themeSettings.colors.bgSecondary },
                    { key: 'bgAccent', label: 'Background Accent', value: themeSettings.colors.bgAccent },
                    { key: 'bgDark', label: 'Background Dark', value: themeSettings.colors.bgDark }
                  ].map((color) => (
                    <div key={color.key} className="text-center">
                      <div 
                        className="w-full h-20 rounded-lg border border-gray-200 mb-2"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <div className="text-sm font-medium text-gray-900">{color.label}</div>
                      <div className="text-xs text-gray-500 font-mono">{color.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ステータスカラー */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">ステータスカラー</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'success', label: 'Success', value: themeSettings.colors.success },
                    { key: 'warning', label: 'Warning', value: themeSettings.colors.warning },
                    { key: 'error', label: 'Error', value: themeSettings.colors.error },
                    { key: 'info', label: 'Info', value: themeSettings.colors.info }
                  ].map((color) => (
                    <div key={color.key} className="text-center">
                      <div 
                        className="w-full h-20 rounded-lg border border-gray-200 mb-2"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <div className="text-sm font-medium text-gray-900">{color.label}</div>
                      <div className="text-xs text-gray-500 font-mono">{color.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'typography':
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">タイポグラフィ</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">フォント設定</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">フォントファミリー</span>
                      <span className="text-sm text-gray-900 font-mono">{themeSettings.typography.fontFamily}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">ベースサイズ</span>
                      <span className="text-sm text-gray-900 font-mono">{themeSettings.typography.fontSize}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">フォントウェイト</span>
                      <span className="text-sm text-gray-900 font-mono">{themeSettings.typography.fontWeight}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">行間</span>
                      <span className="text-sm text-gray-900 font-mono">{themeSettings.typography.lineHeight}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">フォントサンプル</h3>
                  <div className="space-y-4" style={{ fontFamily: themeSettings.typography.fontFamily }}>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">見出し1 (H1)</div>
                      <div className="text-xs text-gray-500">font-size: 1.875rem (30px), font-weight: 700</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">見出し2 (H2)</div>
                      <div className="text-xs text-gray-500">font-size: 1.5rem (24px), font-weight: 700</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 mb-2">見出し3 (H3)</div>
                      <div className="text-xs text-gray-500">font-size: 1.25rem (20px), font-weight: 700</div>
                    </div>
                    <div>
                      <div className="text-base text-gray-700 mb-2">本文テキスト (Body)</div>
                      <div className="text-xs text-gray-500">font-size: 1rem (16px), font-weight: 400</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-2">小さなテキスト (Small)</div>
                      <div className="text-xs text-gray-500">font-size: 0.875rem (14px), font-weight: 400</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'layout':
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">レイアウト仕様</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">スペーシング</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">システム</span>
                      <span className="text-sm font-mono text-gray-900">{themeSettings.layout.spacing}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600">8px基準のスペーシングシステム</div>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 6, 8, 12, 16].map(size => (
                          <div key={size} className="text-center">
                            <div 
                              className="bg-purple-200 rounded"
                              style={{ width: `${size * 4}px`, height: '16px' }}
                            ></div>
                            <div className="text-xs text-gray-500 mt-1">{size * 4}px</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">ボーダー半径</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">システム</span>
                      <span className="text-sm font-mono text-gray-900">{themeSettings.layout.borderRadius}</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Small', value: '4px' },
                        { label: 'Default', value: '8px' },
                        { label: 'Large', value: '12px' },
                        { label: 'XL', value: '16px' }
                      ].map(radius => (
                        <div key={radius.label} className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 bg-blue-200"
                            style={{ borderRadius: radius.value }}
                          ></div>
                          <span className="text-sm text-gray-700">{radius.label}: {radius.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">シャドウ</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">システム</span>
                      <span className="text-sm font-mono text-gray-900">{themeSettings.layout.shadows}</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Small', class: 'shadow-sm' },
                        { label: 'Default', class: 'shadow' },
                        { label: 'Medium', class: 'shadow-md' },
                        { label: 'Large', class: 'shadow-lg' },
                        { label: 'XL', class: 'shadow-xl' }
                      ].map(shadow => (
                        <div key={shadow.label} className={`p-3 bg-white ${shadow.class} rounded-lg`}>
                          <span className="text-sm text-gray-700">{shadow.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ブレークポイント */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">レスポンシブブレークポイント</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { device: 'Mobile', icon: <Smartphone className="w-6 h-6" />, breakpoint: '< 768px', description: 'スマートフォン向け' },
                  { device: 'Tablet', icon: <Tablet className="w-6 h-6" />, breakpoint: '768px - 1024px', description: 'タブレット向け' },
                  { device: 'Desktop', icon: <Monitor className="w-6 h-6" />, breakpoint: '1024px - 1280px', description: 'デスクトップ向け' },
                  { device: 'Large', icon: <Monitor className="w-6 h-6" />, breakpoint: '> 1280px', description: '大画面向け' }
                ].map((bp) => (
                  <div key={bp.device} className="text-center p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
                    <div className="flex justify-center mb-3 text-blue-600">
                      {bp.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{bp.device}</h4>
                    <div className="text-sm font-mono text-purple-600 mb-2">{bp.breakpoint}</div>
                    <div className="text-xs text-gray-600">{bp.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'animations':
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">アニメーション仕様</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">基本設定</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">アニメーション時間</span>
                      <span className="text-sm text-gray-900 font-mono">{themeSettings.animations.duration}ms</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">イージング</span>
                      <span className="text-sm text-gray-900 font-mono">{themeSettings.animations.easing}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">ホバーエフェクト</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        themeSettings.animations.hoverEffects ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {themeSettings.animations.hoverEffects ? '有効' : '無効'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">モーション軽減</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        themeSettings.animations.reducedMotion ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {themeSettings.animations.reducedMotion ? '有効' : '無効'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">アニメーションタイプ</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Fade In', description: '透明度の変化', demo: 'opacity-0 → opacity-100' },
                      { name: 'Slide Up', description: '下から上へのスライド', demo: 'translateY(20px) → translateY(0)' },
                      { name: 'Scale Up', description: 'サイズの拡大', demo: 'scale(0.95) → scale(1)' },
                      { name: 'Slide Left/Right', description: '左右からのスライド', demo: 'translateX(±20px) → translateX(0)' }
                    ].map((animation) => (
                      <div key={animation.name} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-1">{animation.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{animation.description}</p>
                        <code className="text-xs text-purple-600 bg-white px-2 py-1 rounded">{animation.demo}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">コード出力</h2>
              
              {/* CSS変数 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">CSS変数</h3>
                  <button
                    onClick={() => copyToClipboard(generateCSSVariables(), 'css')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                      copiedCode === 'css'
                        ? 'bg-green-600 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {copiedCode === 'css' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode === 'css' ? 'コピー済み' : 'コピー'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{generateCSSVariables()}</code>
                  </pre>
                </div>
              </div>

              {/* Tailwind設定 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Tailwind CSS設定</h3>
                  <button
                    onClick={() => copyToClipboard(generateTailwindConfig(), 'tailwind')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                      copiedCode === 'tailwind'
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {copiedCode === 'tailwind' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode === 'tailwind' ? 'コピー済み' : 'コピー'}</span>
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{generateTailwindConfig()}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">デザイン仕様書</h1>
              <p className="text-gray-600 mt-2">REMILA BHC 2026 サイトのデザインシステム仕様</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                メインサイトに戻る
              </a>
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>印刷/PDF保存</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバーナビゲーション */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">目次</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-100 text-purple-800 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {section.icon}
                    <span className="text-sm">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1">
            {renderSectionContent()}
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 {siteSettings?.company_name || 'REMILA Back Style Hair Contest'}. All rights reserved.
            </p>
            <div className="mt-4">
              <a
                href="/"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm underline"
              >
                メインサイトに戻る
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DesignSpecificationPage;