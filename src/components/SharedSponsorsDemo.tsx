import React, { useState } from 'react';
import { Settings, Palette, Eye, Code, Building } from 'lucide-react';
import SharedSponsorCompanies from '../shared/components/SharedSponsorCompanies';

const SharedSponsorsDemo = () => {
  const [demoConfig, setDemoConfig] = useState({
    siteSlug: 'demo-site',
    maxItems: 6
  });

  const [showCode, setShowCode] = useState(false);

  const generateEmbedCode = () => {
    return `import React from 'react';
import SharedSponsorCompanies from './shared/components/SharedSponsorCompanies';

const MyComponent = () => {

  return (
    <SharedSponsorCompanies 
      siteSlug="${demoConfig.siteSlug}"
      maxItems={${demoConfig.maxItems}}
    />
  );
};

export default MyComponent;`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">共有協賛企業セクション デモ</h1>
              <p className="text-gray-600">他のサイトで使用可能な共有コンポーネントのプレビュー</p>
            </div>
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Code className="w-4 h-4" />
              <span>{showCode ? 'プレビュー' : 'コード表示'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 左側：設定パネル */}
          <div className="lg:col-span-1 space-y-6">
            {/* 基本設定 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">基本設定</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    サイト識別子
                  </label>
                  <input
                    type="text"
                    value={demoConfig.siteSlug}
                    onChange={(e) => setDemoConfig(prev => ({ ...prev, siteSlug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最大表示数
                  </label>
                  <input
                    type="number"
                    value={demoConfig.maxItems}
                    onChange={(e) => setDemoConfig(prev => ({ ...prev, maxItems: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedSponsorsDemo;