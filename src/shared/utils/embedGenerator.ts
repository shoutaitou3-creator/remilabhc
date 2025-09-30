// 埋め込みコード生成ユーティリティ
import { SharedSectionProps, SharedThemeConfig } from '../types';

export interface EmbedConfig {
  sectionType: 'news' | 'judges' | 'prizes' | 'faq' | 'workExamples' | 'sponsors';
  siteSlug: string;
  apiBaseUrl?: string;
  theme?: Partial<SharedThemeConfig>;
  options?: Partial<SharedSectionProps>;
}

export class EmbedCodeGenerator {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://cdn.remilabhc.com') {
    this.baseUrl = baseUrl;
  }

  // React コンポーネント用の埋め込みコード生成
  generateReactEmbed(config: EmbedConfig): string {
    const { sectionType, siteSlug, apiBaseUrl, theme, options } = config;
    
    const componentName = this.getComponentName(sectionType);
    const propsString = this.generatePropsString({ siteSlug, apiBaseUrl, ...options });
    const themeString = theme ? JSON.stringify(theme, null, 2) : 'undefined';

    return `
import React from 'react';
import { ${componentName}, SharedThemeProvider } from '@remila/shared-components';

const MyComponent = () => {
  const customTheme = ${themeString};

  return (
    <SharedThemeProvider initialTheme={customTheme}>
      <${componentName} ${propsString} />
    </SharedThemeProvider>
  );
};

export default MyComponent;
`;
  }

  // HTML + JavaScript用の埋め込みコード生成
  generateHtmlEmbed(config: EmbedConfig): string {
    const { sectionType, siteSlug, apiBaseUrl, theme, options } = config;
    
    const configString = JSON.stringify({
      siteSlug,
      apiBaseUrl,
      theme,
      ...options
    }, null, 2);

    return `
<!-- REMILA 共有セクション: ${sectionType} -->
<div id="remila-${sectionType}-${siteSlug}"></div>

<script src="${this.baseUrl}/remila-shared-components.js"></script>
<script>
  window.RemilaSections.render('${sectionType}', 'remila-${sectionType}-${siteSlug}', ${configString});
</script>
`;
  }

  // iframe用の埋め込みコード生成
  generateIframeEmbed(config: EmbedConfig): string {
    const { sectionType, siteSlug, apiBaseUrl, theme, options } = config;
    
    const params = new URLSearchParams({
      siteSlug,
      ...(apiBaseUrl && { apiBaseUrl }),
      ...(theme && { theme: JSON.stringify(theme) }),
      ...(options && { options: JSON.stringify(options) })
    });

    return `
<!-- REMILA 共有セクション: ${sectionType} -->
<iframe 
  src="${this.baseUrl}/embed/${sectionType}?${params.toString()}"
  width="100%" 
  height="600"
  frameborder="0"
  scrolling="auto"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
  title="REMILA ${sectionType} Section"
></iframe>

<script>
  // レスポンシブ対応のための高さ自動調整
  window.addEventListener('message', function(event) {
    if (event.origin !== '${this.baseUrl}') return;
    if (event.data.type === 'resize') {
      const iframe = document.querySelector('iframe[src*="${sectionType}"]');
      if (iframe) {
        iframe.style.height = event.data.height + 'px';
      }
    }
  });
</script>
`;
  }

  // WordPress ショートコード用の埋め込みコード生成
  generateWordPressShortcode(config: EmbedConfig): string {
    const { sectionType, siteSlug, apiBaseUrl, theme, options } = config;
    
    const attributes = [
      `site_slug="${siteSlug}"`,
      ...(apiBaseUrl ? [`api_base_url="${apiBaseUrl}"`] : []),
      ...(options?.maxItems ? [`max_items="${options.maxItems}"`] : []),
      ...(options?.showTitle !== undefined ? [`show_title="${options.showTitle}"`] : []),
      ...(options?.enableAnimation !== undefined ? [`enable_animation="${options.enableAnimation}"`] : [])
    ].join(' ');

    return `[remila_${sectionType} ${attributes}]`;
  }

  private getComponentName(sectionType: string): string {
    const componentMap = {
      'news': 'SharedNewsSection',
      'judges': 'SharedJudgesSection',
      'prizes': 'SharedPrizesSection',
      'faq': 'SharedFAQSection',
      'workExamples': 'SharedWorkExamplesSection',
      'sponsors': 'SharedSponsorCompanies'
    };
    return componentMap[sectionType as keyof typeof componentMap] || 'SharedSection';
  }

  private generatePropsString(props: Record<string, any>): string {
    return Object.entries(props)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        } else if (typeof value === 'boolean') {
          return value ? key : `${key}={false}`;
        } else if (typeof value === 'number') {
          return `${key}={${value}}`;
        }
        return `${key}={${JSON.stringify(value)}}`;
      })
      .join(' ');
  }
}

export default EmbedCodeGenerator;