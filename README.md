# REMILA BHC 2026 - 共有管理システム

業界初のバックスタイルヘアコンテストの公式サイトと共有管理システムです。

## 特徴

- **共有管理システム**: 複数のLPサイトを単一の管理ページから管理
- **Supabase認証**: 実際のユーザー認証とプロフィール管理
- **マルチサイト対応**: URLパラメータによるサイト識別
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **リアルタイムプレビュー**: 設定変更の即座反映

## 管理ページアクセス方法

### 各LPサイトからのアクセス
各LPサイトの管理者ログインリンクは、以下の形式で共通の管理ページにリダイレクトします：

```
https://your-admin-domain.com/?app=サイト識別子
```

例：
- REMILA BHC: `https://your-admin-domain.com/?app=remila-bhc`
- REMILA LP: `https://your-admin-domain.com/?app=remila-lp`
- RESUSTY コーポレート: `https://your-admin-domain.com/?app=resusty-corporate`

### 認証情報
共通の管理者・編集者アカウントでログイン：
- 管理者: `admin@remilabhc.com`
- 編集者: `editor@resusty.com`

## 環境変数設定

```bash
# Supabase設定
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 共有管理ページのURL（オプション）
VITE_ADMIN_URL=https://your-admin-domain.com
```

## データベース構造

### マルチサイト対応
- `site_settings` テーブルに `site_slug` カラムを追加
- 各LPサイトの設定を個別のレコードとして管理
- コンテンツ（お知らせ、審査員など）は全サイト共有

### 認証・ユーザー管理
- Supabase Authによる実際のユーザー認証
- `user_profiles` テーブルでの権限管理
- 管理者・編集者ロールの共通化

## 開発・デプロイ

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 管理機能

- **ダッシュボード**: 統計情報とKPI管理
- **お知らせ管理**: カテゴリ別お知らせの作成・編集
- **作品例管理**: 作品例の追加・編集・公開管理
- **FAQ管理**: よくある質問の管理
- **審査員管理**: 審査員情報の編集
- **協賛企業管理**: 協賛企業情報の管理
- **賞金賞品管理**: 賞金・賞品情報の管理
- **ユーザー管理**: システムユーザーの招待・権限管理
- **サイト設定**: SEO・メタデータ・連絡先情報の管理

## セキュリティ

- Row Level Security (RLS) による適切なアクセス制御
- 管理者・編集者の権限分離
- Supabaseによる安全な認証・認可

## サポート

技術的な問題や質問については、開発チームまでお問い合わせください。