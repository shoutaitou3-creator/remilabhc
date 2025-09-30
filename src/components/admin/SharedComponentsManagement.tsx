import React, { useState } from 'react';
import { 
  Share2, 
  Code, 
  Eye, 
  Settings,
  Palette,
  Copy,
  Building,
  ExternalLink,
  Monitor
} from 'lucide-react';

const SharedComponentsManagement = () => {
  const [selectedComponent, setSelectedComponent] = useState('news');
  const [previewConfig, setPreviewConfig] = useState({
    maxItems: 3,
    showTitle: true,
    enableAnimation: true,
    customTheme: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#06B6D4',
        accent: '#F59E0B'
      }
    }
  });
  const [showCode, setShowCode] = useState(false);

  const components = [
    { id: 'news', name: 'お知らせセクション', description: '最新のお知らせ・新着情報を表示' },
    { id: 'judges', name: '審査員セクション', description: '審査員の紹介と詳細情報' },
    { id: 'prizes', name: '賞金賞品セクション', description: '賞金・賞品の詳細情報' },
    { id: 'faq', name: 'FAQセクション', description: 'よくある質問と回答' },
    { id: 'workExamples', name: '作品例セクション', description: '作品例の紹介' },
    { id: 'sponsors', name: '協賛企業セクション', description: '協賛企業の紹介' },
    { id: 'resourceDownload', name: '資料ダウンロードセクション', description: 'ダウンロード可能な資料の表示' }
  ];

  const generateEmbedCode = () => {
    const componentMap = {
      'news': {
        import: "import SharedNewsSection from './shared/components/SharedNewsSection';",
        component: 'SharedNewsSection',
      },
      'sponsors': {
        import: "import SharedSponsorCompanies from './shared/components/SharedSponsorCompanies';",
        component: 'SharedSponsorCompanies',
      },
      'judges': {
        import: "import SharedJudgesSection from './shared/components/SharedJudgesSection';",
        component: 'SharedJudgesSection',
      },
      'prizes': {
        import: "import SharedPrizesSection from './shared/components/SharedPrizesSection';",
        component: 'SharedPrizesSection',
      },
      'faq': {
        import: "import SharedFAQSection from './shared/components/SharedFAQSection';",
        component: 'SharedFAQSection',
      },
      'workExamples': {
        import: "import SharedWorkExamplesSection from './shared/components/SharedWorkExamplesSection';",
        component: 'SharedWorkExamplesSection',
      },
      'resourceDownload': {
        import: "import SharedResourceDownloadSection from './shared/components/SharedResourceDownloadSection';",
        component: 'SharedResourceDownloadSection',
      }
    };

    const selectedComponentInfo = componentMap[selectedComponent as keyof typeof componentMap];
    if (!selectedComponentInfo) {
      return `// 選択されたコンポーネント "${selectedComponent}" は未実装です`;
    }

    return `import React from 'react';
${selectedComponentInfo.import}

const MyComponent = () => {
  return (
    <${selectedComponentInfo.component} 
      siteSlug="remila-bhc"
      maxItems={${previewConfig.maxItems}}
    />
  );
};

export default MyComponent;`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('コードをクリップボードにコピーしました');
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">共有コンポーネント管理</h2>
        <p className="text-gray-600">他のサイトで使用可能な共有コンポーネントの設定と埋め込みコード生成</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 左側：コンポーネント選択 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">利用可能なコンポーネント</h3>
            <div className="space-y-2">
              {components.map((component) => (
                <button
                  key={component.id}
                  onClick={() => setSelectedComponent(component.id)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    selectedComponent === component.id
                      ? 'bg-purple-100 border-2 border-purple-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <h4 className="font-medium text-gray-900">{component.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 設定パネル */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">設定</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最大表示数
                </label>
                <input
                  type="number"
                  value={previewConfig.maxItems}
                  onChange={(e) => setPreviewConfig(prev => ({ 
                    ...prev, 
                    maxItems: parseInt(e.target.value) || 3 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  min="1"
                  max="10"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={previewConfig.showTitle}
                    onChange={(e) => setPreviewConfig(prev => ({ 
                      ...prev, 
                      showTitle: e.target.checked 
                    }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">タイトル表示</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={previewConfig.enableAnimation}
                    onChange={(e) => setPreviewConfig(prev => ({ 
                      ...prev, 
                      enableAnimation: e.target.checked 
                    }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">アニメーション</span>
                </label>
              </div>
            </div>
          </div>

          {/* テーマ設定 */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">テーマ設定</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(previewConfig.customTheme.colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setPreviewConfig(prev => ({
                        ...prev,
                        customTheme: {
                          ...prev.customTheme,
                          colors: {
                            ...prev.customTheme.colors,
                            [key]: e.target.value
                          }
                        }
                      }))}
                      className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setPreviewConfig(prev => ({
                        ...prev,
                        customTheme: {
                          ...prev.customTheme,
                          colors: {
                            ...prev.customTheme.colors,
                            [key]: e.target.value
                          }
                        }
                      }))}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右側：プレビュー/コード表示 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {showCode ? '埋め込みコード' : 'ライブプレビュー'}
                  </h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    リアルタイム連動
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                      showCode 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {showCode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                    <span>{showCode ? 'プレビュー' : 'コード'}</span>
                  </button>
                  {showCode && (
                    <button
                      onClick={() => copyToClipboard(generateEmbedCode())}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      <span>コピー</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {showCode ? (
                <div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                    <pre className="text-green-400 text-sm">
                      <code>{generateEmbedCode()}</code>
                    </pre>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">実装手順</h4>
                    <ol className="text-xs text-blue-700 space-y-1">
                      <li>1. 上記のコードを他のReactプロジェクトにコピー</li>
                      <li>2. 対応する共有コンポーネントファイルをコピー</li>
                      <li>3. 必要な依存関係（lucide-react等）をインストール</li>
                      <li>4. Supabaseの環境変数を設定</li>
                      <li>5. コンポーネントをインポートして使用</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* 実際のプレビューをここに表示 */}
                  <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {components.find(c => c.id === selectedComponent)?.name} プレビュー
                      </h2>
                      <p className="text-gray-600">実際の表示イメージ</p>
                    </div>
                    
                    {selectedComponent === 'news' && (
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <span 
                            className="text-xs px-2 py-1 rounded font-medium text-white"
                            style={{ backgroundColor: previewConfig.customTheme.colors.primary }}
                          >
                            新着情報
                          </span>
                          <span className="text-sm text-gray-500">2025/01/15</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          サンプルお知らせタイトル
                        </h3>
                        <p className="text-gray-600 text-sm">
                          これは共有お知らせセクションのプレビューです。実際のデータは元サイトから自動取得されます。
                        </p>
                      </div>
                    )}
                    
                    {selectedComponent === 'sponsors' && (
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">サンプル協賛企業</h3>
                            <span className="text-xs px-2 py-1 rounded font-medium bg-yellow-100 text-yellow-800">
                              ゴールド
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          これは共有協賛企業セクションのプレビューです。実際のデータは元サイトから自動取得されます。
                        </p>
                        <div 
                          className="p-3 rounded"
                        >
                          <p className="font-semibold text-sm text-purple-800">
                            【サンプル企業賞】豪華賞品
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {!['news', 'sponsors'].includes(selectedComponent) && (
                      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Code className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {components.find(c => c.id === selectedComponent)?.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {selectedComponent === 'resourceDownload' 
                            ? 'このセクションは実装済みです。コードを生成してご利用ください。'
                            : 'このセクションの共有コンポーネントは開発中です。コードは生成されますが、実際のコンポーネントはまだ実装されていません。'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 使用例 */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">使用例</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">協賛募集サイト</h4>
                <p className="text-sm text-green-700 mb-3">
                  {components.find(c => c.id === selectedComponent)?.name}を表示
                </p>
                <div className="text-xs text-green-600 font-mono bg-white p-2 rounded">
                  maxItems: {selectedComponent === 'sponsors' ? '6' : '3'}
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">RESUSTY公式サイト</h4>
                <p className="text-sm text-purple-700 mb-3">
                  {components.find(c => c.id === selectedComponent)?.name}を表示
                </p>
                <div className="text-xs text-purple-600 font-mono bg-white p-2 rounded">
                  maxItems: {selectedComponent === 'sponsors' ? '6' : selectedComponent === 'resourceDownload' ? '10' : '5'}
                </div>
              </div>
            </div>
          </div>

          {/* デモリンク */}
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">デモページ</h3>
            <p className="text-gray-600 mb-4">
              実際の共有コンポーネントの動作を確認できるデモページです
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="?demo=shared-news"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>お知らせデモ</span>
              </a>
              <a
                href="?demo=shared-sponsors"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>協賛企業デモ</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">利用可能コンポーネント</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">7個</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Share2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">対応フレームワーク</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">React</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Code className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">リアルタイム同期</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">有効</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Monitor className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">カスタマイズ</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">自由</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Palette className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedComponentsManagement;