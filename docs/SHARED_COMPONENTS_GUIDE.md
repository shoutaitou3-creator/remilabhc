# REMILA 共有コンポーネントシステム

## 概要

REMILA BHCサイトの各セクション（お知らせ、審査員、賞金賞品など）を他のサイトで再利用可能な共有コンポーネントシステムです。

## 特徴

- **リアルタイム連動**: 元サイトでの変更が自動的に共有先サイトに反映
- **テーマカスタマイズ**: 各サイトに合わせた色やフォントの調整が可能
- **レスポンシブ対応**: モバイル・タブレット・デスクトップで最適表示
- **複数の埋め込み方法**: React、HTML、iframe、WordPressに対応

## 使用方法

### 1. React アプリケーションでの使用

```bash
npm install @remila/shared-components
```

```tsx
import React from 'react';
import { 
  SharedNewsSection, 
  SharedJudgesSection, 
  SharedThemeProvider 
} from '@remila/shared-components';

const MyApp = () => {
  const customTheme = {
    colors: {
      primary: '#your-primary-color',
      secondary: '#your-secondary-color'
    }
  };

  return (
    <SharedThemeProvider initialTheme={customTheme}>
      <SharedNewsSection 
        siteSlug="remila-bhc"
        maxItems={5}
        showTitle={true}
        enableAnimation={true}
      />
      <SharedJudgesSection 
        siteSlug="remila-bhc"
        maxItems={8}
      />
    </SharedThemeProvider>
  );
};
```

### 2. HTML サイトでの使用

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Site</title>
</head>
<body>
  <!-- お知らせセクション -->
  <div id="remila-news-section"></div>
  
  <!-- 審査員セクション -->
  <div id="remila-judges-section"></div>

  <script src="https://cdn.remilabhc.com/remila-shared-components.js"></script>
  <script>
    // お知らせセクションを埋め込み
    window.RemilaSections.render('news', 'remila-news-section', {
      siteSlug: 'remila-bhc',
      maxItems: 5,
      theme: {
        colors: {
          primary: '#your-primary-color'
        }
      }
    });

    // 審査員セクションを埋め込み
    window.RemilaSections.render('judges', 'remila-judges-section', {
      siteSlug: 'remila-bhc',
      maxItems: 8
    });
  </script>
</body>
</html>
```

### 3. iframe での使用

```html
<!-- お知らせセクション -->
<iframe 
  src="https://cdn.remilabhc.com/embed/news?siteSlug=remila-bhc&maxItems=5"
  width="100%" 
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>

<!-- 審査員セクション -->
<iframe 
  src="https://cdn.remilabhc.com/embed/judges?siteSlug=remila-bhc&maxItems=8"
  width="100%" 
  height="800"
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>
```

### 4. WordPress での使用

```php
// functions.php に追加
function remila_shared_components_shortcode($atts) {
    $atts = shortcode_atts(array(
        'type' => 'news',
        'site_slug' => 'remila-bhc',
        'max_items' => 5,
        'show_title' => 'true',
        'enable_animation' => 'true'
    ), $atts);

    $config = json_encode($atts);
    $unique_id = 'remila-' . $atts['type'] . '-' . uniqid();

    return "
    <div id='{$unique_id}'></div>
    <script>
      if (typeof window.RemilaSections !== 'undefined') {
        window.RemilaSections.render('{$atts['type']}', '{$unique_id}', {$config});
      }
    </script>
    ";
}
add_shortcode('remila_section', 'remila_shared_components_shortcode');
```

投稿やページで使用:
```
[remila_section type="news" site_slug="remila-bhc" max_items="5"]
[remila_section type="judges" site_slug="remila-bhc" max_items="8"]
```

## 利用可能なセクション

| セクション | 説明 | 主な用途 |
|-----------|------|----------|
| `news` | お知らせ・新着情報 | 最新情報の共有 |
| `judges` | 審査員紹介 | 権威性の向上 |
| `prizes` | 賞金・賞品情報 | 参加動機の向上 |
| `faq` | よくある質問 | サポート情報 |
| `workExamples` | 作品例 | 参考事例の提示 |
| `sponsors` | 協賛企業 | パートナー紹介 |
| `resourceDownload` | 資料ダウンロード | 資料提供・リード獲得 |

## カスタマイズオプション

### 基本オプション

- `siteSlug`: データソースとなるサイトの識別子
- `maxItems`: 表示する最大アイテム数
- `showTitle`: セクションタイトルの表示/非表示
- `enableAnimation`: アニメーション効果の有効/無効
- `className`: 追加のCSSクラス

### テーマカスタマイズ

```typescript
const customTheme = {
  colors: {
    primary: '#your-brand-color',
    secondary: '#your-accent-color',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f1f5f9'
  },
  typography: {
    fontFamily: 'Your Font Family',
    fontSize: {
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
  },
  spacing: {
    section: '3rem',
    container: '1rem'
  },
  animation: {
    duration: 560,
    easing: 'ease-out'
  }
};
```

## 自動更新機能

共有コンポーネントは以下の方法で自動更新されます：

1. **リアルタイム更新**: Supabaseのリアルタイム機能を使用
2. **定期更新**: 設定可能な間隔での自動データ取得
3. **手動更新**: ユーザーアクションによる即座の更新

## セキュリティ

- **CORS設定**: 許可されたドメインからのみアクセス可能
- **API制限**: レート制限とアクセス制御
- **データ検証**: 不正なデータの表示を防止

## パフォーマンス

- **CDN配信**: 高速な読み込み
- **キャッシュ最適化**: 効率的なデータ取得
- **遅延読み込み**: 必要に応じた画像の読み込み

## サポート

技術的な問題や質問については、開発チームまでお問い合わせください。