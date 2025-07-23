# Finance Dashboard

暗号資産ポートフォリオ管理ダッシュボード

## 概要

Next.js (App Router) を使用した暗号資産ポートフォリオ管理アプリケーション。Coincheck・CoinGecko APIと連携し、リアルタイムな資産状況の可視化を提供します。

## 技術スタック

| 分類 | 技術 | 用途 |
|------|------|------|
| フレームワーク | Next.js 15.4.2 (App Router) | フロント/バックエンド統合 |
| 言語 | TypeScript 5.x | 型安全な開発 |
| UI | React 19.1.0, Recharts | UI構築・グラフ描画 |
| スタイリング | Tailwind CSS | ユーティリティCSS |
| HTTP通信 | Axios | 外部API呼び出し |
| テスト | Jest, React Testing Library | 単体・結合テスト |
| 品質管理 | ESLint, Prettier | コード品質維持 |
| ドキュメント | Storybook | UIカタログ |

## セットアップ

詳細なセットアップ手順は [SETUP.md](./SETUP.md) を参照してください。

### クイックスタート

```bash
# リポジトリクローン
git clone <repository-url>
cd finance-dashboard

# 依存関係インストール
yarn install

# 環境変数設定
cp .env.local.example .env.local
# .env.local を編集してAPIキーを設定

# 開発サーバー起動
yarn dev
```

## アーキテクチャ

### システム構成
- **Next.js App Router**: フロント/バックエンド一体型構成
- **ISR/SSG**: 高速ページ配信
- **API Routes**: サーバーレスAPI実装
- **外部API連携**: Coincheck, CoinGecko
- **Vercel**: CDN配信・Edge Functions

### ディレクトリ構成

```
finance-dashboard/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   └── globals.css        # グローバルスタイル
├── components/            # UIコンポーネント (Atomic Design)
│   ├── atoms/            # 基本要素
│   ├── molecules/        # 複合要素
│   ├── organisms/        # 複雑な要素
│   ├── templates/        # ページテンプレート
│   └── charts/           # グラフコンポーネント
├── lib/                  # ユーティリティ・API
│   ├── api.ts           # API共通処理
│   ├── coincheck.ts     # Coincheck API
│   ├── coingecko.ts     # CoinGecko API
│   └── utils.ts         # ユーティリティ関数
├── pages/               # Pages Router (API Routes)
│   ├── api/            # APIエンドポイント
│   └── assets/         # 静的アセット
├── types/              # TypeScript型定義
├── styles/             # スタイルファイル
├── public/             # 静的ファイル
└── .storybook/         # Storybook設定
```

## API仕様

### エンドポイント一覧

| エンドポイント | メソッド | 概要 |
|---------------|----------|------|
| `/api/portfolio-summary` | GET | ポートフォリオ集計取得 |
| `/api/assets` | GET | 保有資産一覧取得 |
| `/api/assets/[id]` | GET | 個別資産詳細取得 |

### 外部API連携

- **Coincheck API**: 保有資産・取引履歴取得
- **CoinGecko API**: 価格情報・市場データ取得

## 開発ガイド

### 利用可能なコマンド

```bash
yarn dev          # 開発サーバー起動
yarn build        # プロダクションビルド
yarn start        # プロダクションサーバー起動
yarn lint         # ESLintチェック
yarn test         # テスト実行
yarn storybook    # Storybook起動
```

### コード品質

- **ESLint**: TypeScript・React・Next.js用ルール適用
- **Prettier**: コードフォーマット統一
- **Jest**: 単体テスト
- **Storybook**: UIコンポーネントカタログ

## セキュリティ

セキュリティ運用ルールは [SECURITY.md](./SECURITY.md) を参照してください。

### 重要事項
- APIキーは `.env.local` で管理（Git管理対象外）
- 本番環境では Vercel Dashboard で環境変数設定
- 機密情報のハードコーディング禁止

## デプロイ

Vercel での自動デプロイに対応。`main` ブランチへのプッシュで本番環境に自動デプロイされます。

## ライセンス

Private Project
