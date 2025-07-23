/**
 * 資産関連の型定義
 */

// 基本資産情報
export interface Asset {
  id: string;                    // 資産ID (例: 'btc', 'eth')
  name: string;                  // 資産名 (例: 'Bitcoin', 'Ethereum')
  symbol: string;                // シンボル (例: 'BTC', 'ETH')
  amount: number;                // 保有数量
  value: number;                 // 評価額（JPY）
  currentPrice: number;          // 現在価格（JPY）
  change24h?: number;            // 24時間変動額
  changePercent24h?: number;     // 24時間変動率（%）
}

// 詳細資産情報
export interface AssetDetail extends Asset {
  priceHistory: PriceHistory[];  // 価格履歴
  marketCap?: number;            // 時価総額
  volume24h?: number;            // 24時間取引量
  rank?: number;                 // 市場ランキング
  supply?: AssetSupply;          // 供給量情報
  ath?: AssetHighLow;            // 過去最高値情報
  atl?: AssetHighLow;            // 過去最安値情報
  lastUpdated?: string;          // 最終更新日時
}

// 価格履歴
export interface PriceHistory {
  date: string;                  // 日付 (ISO 8601)
  price: number;                 // 価格
  volume?: number;               // 取引量
  marketCap?: number;            // 時価総額
}

// 供給量情報
export interface AssetSupply {
  circulating: number;           // 流通供給量
  total: number;                 // 総供給量
  max?: number;                  // 最大供給量
}

// 過去最高値・最安値情報
export interface AssetHighLow {
  value: number;                 // 価格
  date: string;                  // 日付
  changePercentage: number;      // 現在価格からの変動率
}

// 資産カテゴリ
export type AssetCategory = 
  | 'cryptocurrency'             // 暗号資産
  | 'stablecoin'                // ステーブルコイン
  | 'defi'                      // DeFiトークン
  | 'nft'                       // NFT関連
  | 'other';                    // その他

// 資産ステータス
export type AssetStatus = 
  | 'active'                    // アクティブ
  | 'inactive'                  // 非アクティブ
  | 'delisted';                 // 上場廃止

// 拡張資産情報（将来の機能拡張用）
export interface ExtendedAsset extends AssetDetail {
  category: AssetCategory;       // カテゴリ
  status: AssetStatus;          // ステータス
  description?: string;         // 説明
  website?: string;             // 公式サイト
  whitepaper?: string;          // ホワイトペーパー
  tags?: string[];              // タグ
}