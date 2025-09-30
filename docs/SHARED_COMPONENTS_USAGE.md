# REMILA 共有コンポーネント使用ガイド

## 概要

REMILA BHCサイトの各セクションを他のサイトで再利用可能にする共有コンポーネントシステムです。

## 特徴

- **リアルタイム連動**: 元サイトでの変更が自動的に共有先サイトに反映
- **テーマカスタマイズ**: 各サイトに合わせた色やフォントの調整が可能
- **TypeScript対応**: 型安全性を保持
- **レスポンシブ対応**: モバイル・タブレット・デスクトップで最適表示

## 使用方法

### 1. 基本的な使用方法

```tsx
import React from 'react';
import SharedNewsSection from './shared/components/SharedNewsSection';
import SharedSponsorCompanies from './shared/components/SharedSponsorCompanies';

const MyApp = () => {
  return (
    <div>
      <SharedNewsSection 
        siteSlug="remila-bhc"
        maxItems={5}
        showTitle={true}
        enableAnimation={true}
      />
      <SharedSponsorCompanies 
        siteSlug="remila-bhc"
        maxItems={6}
        showTitle={true}
        enableAnimation={true}
      />
    </div>
  );
};
```

### 2. テーマカスタマイズ

```tsx
  SharedResourceDownloadSection,
import React from 'react';
import SharedNewsSection from './shared/components/SharedNewsSection';

const MyApp = () => {
  const customTheme = {
    colors: {
      primary: '#3b82f6',      // メインカラー
      secondary: '#06b6d4',    // アクセントカラー
      background: '#ffffff',   // 背景色
      text: '#1f2937',         // テキスト色
      accent: '#f1f5f9'        // アクセント背景色
    },
    typography: {
      fontFamily: 'Inter, sans-serif'
    }
  };

  return (
    <SharedNewsSection 
      siteSlug="remila-bhc"
      maxItems={3}
      customTheme={customTheme}
      className="my-custom-section"
    />
  );
};
```

### 3. 複数サイトでの使用例

#### サイトA（協賛募集サイト）
```tsx
const SponsorSite = () => {
  const sponsorTheme = {
    colors: {
      primary: '#059669',    // グリーン系
      secondary: '#0d9488',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#f0fdf4'
    }
  };

  return (
    <div>
      <h1>協賛企業募集</h1>
      <SharedNewsSection 
        siteSlug="remila-bhc"
        maxItems={3}
        customTheme={sponsorTheme}
        showTitle={false}
      />
      <SharedSponsorCompanies 
        siteSlug="remila-bhc"
        maxItems={6}
        customTheme={sponsorTheme}
      />
    </div>
  );
};
```

#### サイトB（RESUSTY公式サイト）
```tsx
const ResustySite = () => {
  const resustyTheme = {
    colors: {
      primary: '#7c3aed',    // 紫系
      secondary: '#a855f7',
      background: '#fafafa',
      text: '#18181b',
      accent: '#f4f4f5'
    }
  };

  return (
    <div>
      <h1>RESUSTY公式サイト</h1>
      <SharedNewsSection 
        siteSlug="remila-bhc"
        maxItems={5}
        customTheme={resustyTheme}
      />
    </div>
  );
};
```

      <SharedResourceDownloadSection 
        siteSlug="remila-bhc"
        maxItems={5}
        categoryFilter="brochures"
        showCompletionDialog={true}
        redirectAfterDownload={true}
        customRedirectUrl="https://example.com/thank-you"
      />
## プロパティ一覧

| プロパティ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `siteSlug` | string | 'remila-bhc' | データソースとなるサイトの識別子 |
| `maxItems` | number | 3 | 表示する最大アイテム数 |
| `showTitle` | boolean | true | セクションタイトルの表示/非表示 |
| `enableAnimation` | boolean | true | アニメーション効果の有効/無効 |
| `className` | string | '' | 追加のCSSクラス |
| `customTheme` | object | undefined | カスタムテーマ設定 |

## 環境変数設定

共有コンポーネントを使用するサイトでは、以下の環境変数を設定してください：

```bash
# .env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 自動更新機能

共有コンポーネントは以下の方法で自動更新されます：

1. **Supabaseリアルタイム更新**: データベースの変更を即座に検知
2. **定期更新**: 30秒間隔でのデータ再取得（フォールバック）
3. **エラー時の再試行**: ネットワークエラー時の自動復旧

## トラブルシューティング

### よくある問題

1. **データが表示されない**
   - Supabase環境変数が正しく設定されているか確認
   - ネットワーク接続を確認
   - ブラウザのコンソールでエラーメッセージを確認

2. **スタイルが適用されない**
   - customThemeの色コードが正しいHEX形式（#rrggbb）か確認
   - CSSの競合がないか確認

3. **リアルタイム更新が動作しない**
   - Supabaseのリアルタイム機能が有効になっているか確認
   - ブラウザがWebSocketをサポートしているか確認

## パフォーマンス最適化

- **メモ化**: React.memoを使用してレンダリング最適化
- **遅延読み込み**: 画像の遅延読み込み対応
- **キャッシュ**: ローカルストレージでのデータキャッシュ

## セキュリティ

- **RLS（Row Level Security）**: Supabaseの行レベルセキュリティで適切なアクセス制御
- **CORS設定**: 許可されたドメインからのみアクセス可能
- **データ検証**: 不正なデータの表示を防止

## サポート

技術的な問題や質問については、開発チームまでお問い合わせください。

```
[remila_section type="news" site_slug="remila-bhc" max_items="5"]
[remila_section type="judges" site_slug="remila-bhc" max_items="8"]
[remila_section type="resourceDownload" site_slug="remila-bhc" max_items="5" category_filter="brochures"]
```