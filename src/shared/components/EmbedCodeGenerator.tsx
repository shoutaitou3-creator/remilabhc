// 埋め込みコード生成UI
import React, { useState } from 'react';
import { Copy, Code, Smartphone, Monitor, Globe } from 'lucide-react';
import EmbedCodeGenerator, { EmbedConfig } from '../utils/embedGenerator';

const EmbedCodeGeneratorUI: React.FC = () => {
  const [config, setConfig] = useState<EmbedConfig>({
    sectionType: 'news',
    siteSlug: 'remila-bhc',
    options: {
      maxItems: 5,
      showTitle: true,
      enableAnimation: true
    }
  });
  const [embedType, setEmbedType] = useState<'react' | 'html' | 'iframe' | 'wordpress'>('react');
  const [copiedCode, setCopiedCode] = useState<string>('');

  const generator = new EmbedCodeGenerator();

  const generateCode = () => {
    switch (embedType) {
      case 'react':
        return generator.generateReactEmbed(config);
      case 'html':
        return generator.generateHtmlEmbed(config);
      case 'iframe':
        return generator.generateIframeEmbed(config);
      case 'wordpress':
        return generator.generateWordPressShortcode(config);
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    const code = generateCode();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(embedType);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  const updateConfig = (field: keyof EmbedConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateOptions = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">埋め込みコード生成</h2>
        <p className="text-gray-600">
          REMILAのセクションを他のサイトに埋め込むためのコードを生成します
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 左側：設定パネル */}
        <div className="space-y-6">
          {/* セクション選択 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">セクション設定</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  セクションタイプ
                </label>
                <select
                  value={config.sectionType}
                  onChange={(e) => updateConfig('sectionType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="news">お知らせ</option>
                  <option value="judges">審査員</option>
                  <option value="prizes">賞金・賞品</option>
                  <option value="faq">よくある質問</option>
                  <option value="workExamples">作品例</option>
                  <option value="sponsors">協賛企業</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サイト識別子
                </label>
                <input
                  type="text"
                  value={config.siteSlug}
                  onChange={(e) => updateConfig('siteSlug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="remila-bhc"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最大表示数
                </label>
                <input
                  type="number"
                  value={config.options?.maxItems || 5}
                  onChange={(e) => updateOptions('maxItems', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                  max="20"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.options?.showTitle ?? true}
                    onChange={(e) => updateOptions('showTitle', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">タイトル表示</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.options?.enableAnimation ?? true}
                    onChange={(e) => updateOptions('enableAnimation', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">アニメーション</span>
                </label>
              </div>
            </div>
          </div>

          {/* 埋め込み方法選択 */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">埋め込み方法</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setEmbedType('react')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  embedType === 'react' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Code className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">React</div>
              </button>
              
              <button
                onClick={() => setEmbedType('html')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  embedType === 'html' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Globe className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">HTML</div>
              </button>
              
              <button
                onClick={() => setEmbedType('iframe')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  embedType === 'iframe' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Monitor className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">iframe</div>
              </button>
              
              <button
                onClick={() => setEmbedType('wordpress')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  embedType === 'wordpress' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Smartphone className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">WordPress</div>
              </button>
            </div>
          </div>
        </div>

        {/* 右側：生成されたコード */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">生成されたコード</h3>
              <button
                onClick={handleCopy}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  copiedCode === embedType
                    ? 'bg-green-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Copy className="w-4 h-4" />
                <span>{copiedCode === embedType ? 'コピー済み' : 'コピー'}</span>
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm whitespace-pre-wrap">
                <code>{generateCode()}</code>
              </pre>
            </div>
          </div>

          {/* プレビュー */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">プレビュー</h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600 text-center">
                実際の埋め込み表示のプレビューがここに表示されます
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedCodeGeneratorUI;