// HTML用の共有コンポーネントラッパー
import React from 'react';
import ReactDOM from 'react-dom/client';
import SharedNewsSection from '../components/SharedNewsSection';
import SharedSponsorCompanies from '../components/SharedSponsorCompanies';
import SharedResourceDownloadSection from '../components/SharedResourceDownloadSection';

// グローバルオブジェクトの型定義
declare global {
  interface Window {
    RemilaSections: {
      render: (type: string, containerId: string, config: any) => void;
      unmount: (containerId: string) => void;
    };
  }
}

// コンポーネントマッピング
const componentMap = {
  news: SharedNewsSection,
  sponsors: SharedSponsorCompanies,
  resourceDownload: SharedResourceDownloadSection
};

// レンダリング関数
const render = (type: string, containerId: string, config: any = {}) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  const Component = componentMap[type as keyof typeof componentMap];
  if (!Component) {
    console.error(`Component type "${type}" not found`);
    return;
  }

  try {
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(Component, config));
    
    // アンマウント用にrootを保存
    (container as any).__reactRoot = root;
    
    console.log(`Successfully rendered ${type} component in ${containerId}`);
  } catch (error) {
    console.error(`Error rendering ${type} component:`, error);
  }
};

// アンマウント関数
const unmount = (containerId: string) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const root = (container as any).__reactRoot;
  if (root) {
    root.unmount();
    delete (container as any).__reactRoot;
  }
};

// グローバルオブジェクトとして公開
window.RemilaSections = {
  render,
  unmount
};

// 初期化完了をログ出力
console.log('REMILA Shared Components initialized');