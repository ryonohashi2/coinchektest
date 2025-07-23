# API Routes

Next.js API Routesによるサーバーレス API実装

## エンドポイント一覧

### ポートフォリオ関連
- `GET /api/portfolio-summary` - ポートフォリオサマリー取得
- `GET /api/assets` - 保有資産一覧取得
- `GET /api/assets/[id]` - 個別資産詳細取得

### 外部API連携
- `GET /api/coincheck/balance` - Coincheck残高取得
- `GET /api/coingecko/prices` - CoinGecko価格情報取得

## 実装方針
- TypeScript による型安全な実装
- エラーハンドリングの統一
- レスポンス形式の統一
- 適切なHTTPステータスコード
- セキュリティ対策（レート制限等）