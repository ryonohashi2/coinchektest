# 開発環境セットアップ手順書

## 必要な環境

### Node.js
- **バージョン**: 18.x (推奨: 18.17.0以上)
- **インストール方法**: 
  - [公式サイト](https://nodejs.org/)からダウンロード
  - または nvm を使用: `nvm install 18 && nvm use 18`

### Yarn
- **バージョン**: 1.22.x (推奨: 1.22.19以上)
- **インストール方法**: `npm install -g yarn@1.22.19`

### Git
- **バージョン**: 2.30以上
- **設定確認**: `git --version`

## セットアップ手順

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd finance-dashboard
```

### 2. 依存パッケージのインストール
```bash
yarn install
```

### 3. 環境変数の設定
```bash
# .env.local.example をコピーして .env.local を作成
cp .env.local.example .env.local

# 必要なAPIキーを設定（後述）
```

### 4. 開発サーバーの起動
```bash
yarn dev
```

ブラウザで http://localhost:3000 にアクセスして動作確認

## 利用可能なコマンド

| コマンド | 説明 |
|----------|------|
| `yarn dev` | 開発サーバー起動 |
| `yarn build` | プロダクションビルド |
| `yarn start` | プロダクションサーバー起動 |
| `yarn lint` | ESLintによるコードチェック |
| `yarn test` | Jestによるテスト実行 |
| `yarn storybook` | Storybook起動 |

## トラブルシューティング

### Node.jsバージョンエラー
```bash
# nvmを使用してバージョンを切り替え
nvm use 18
```

### Yarnインストールエラー
```bash
# キャッシュクリア後に再インストール
yarn cache clean
yarn install
```

### ポート競合エラー
```bash
# 別のポートで起動
yarn dev -p 3001
```