import { useEffect } from 'react';
import { useSiteSettings } from './useSiteSettings';

export const useSiteMetadata = () => {
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    if (!loading && settings) {
      // ページタイトルを更新
      document.title = settings.site_title;

      // メタタグを更新
      updateMetaTag('description', settings.meta_description);
      updateMetaTag('keywords', settings.site_keywords);
      
      // Open Graphタグを更新
      updateMetaProperty('og:title', settings.og_title);
      updateMetaProperty('og:description', settings.og_description);
      updateMetaProperty('og:image', settings.og_image);
      updateMetaProperty('og:url', window.location.href);
      updateMetaProperty('og:type', 'website');
      
      // Twitterカードタグを更新
      updateMetaName('twitter:card', 'summary_large_image');
      updateMetaName('twitter:title', settings.og_title);
      updateMetaName('twitter:description', settings.og_description);
      updateMetaName('twitter:image', settings.og_image);

      // ファビコンを更新
      updateFavicon(settings.favicon);

      // Google Analyticsを設定
      if (settings.analytics_id) {
        loadGoogleAnalytics(settings.analytics_id);
      }
    }
  }, [settings, loading]);

  return { settings, loading };
};

// メタタグを更新するヘルパー関数
const updateMetaTag = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

// Open Graphプロパティを更新するヘルパー関数
const updateMetaProperty = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

// Twitterメタタグを更新するヘルパー関数
const updateMetaName = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

// ファビコンを更新するヘルパー関数
const updateFavicon = (href: string) => {
  // キャッシュバスティング用のクエリパラメータを追加
  const hrefWithCacheBuster = href.includes('?') ? href : `${href}?v=${Date.now()}`;
  
  let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  
  // 強制的にブラウザに再読み込みさせるため、一度削除してから再追加
  const tempLink = link.cloneNode(true) as HTMLLinkElement;
  tempLink.href = hrefWithCacheBuster;
  document.head.removeChild(link);
  document.head.appendChild(tempLink);
  
  console.log('ファビコンを更新しました:', hrefWithCacheBuster);
};

// Google Analyticsを読み込むヘルパー関数
const loadGoogleAnalytics = (analyticsId: string) => {
  // 既存のスクリプトがあるかチェック
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${analyticsId}"]`)) {
    return;
  }

  // Google Analyticsスクリプトを追加
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
  document.head.appendChild(script);

  // gtag設定スクリプトを追加
  const configScript = document.createElement('script');
  configScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${analyticsId}');
  `;
  document.head.appendChild(configScript);
};