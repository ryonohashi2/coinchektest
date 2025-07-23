/**
 * ポートフォリオ関連の型定義
 */

import { Asset, AssetDetail } from './asset';

// 基本ポートフォリオ情報
export interface Portfolio {
  id?: string;                   // ポートフォリオID
  name?: string;                 // ポートフォリオ名
  totalValue: number;            // 総評価額（JPY）
  totalChange24h: number;        // 24時間変動額
  totalChangePercent24h: number; // 24時間変動率（%）
  assets: Asset[];               // 保有資産一覧
  lastUpdated: string;           // 最終更新日時
  createdAt?: string;            // 作成日時
}

// ポートフォリオサマリー
export interface PortfolioSummary {
  totalValue: number;            // 総評価額
  totalChange24h?: number;       // 24時間変動額
  totalChangePercent24h?: number;// 24時間変動率
  assets: AssetSummary[];        // 資産サマリー一覧
  lastUpdated?: string;          // 最終更新日時
}

// 資産サマリー
export interface AssetSummary {
  id: string;                    // 資産ID
  name: string;                  // 資産名
  symbol: string;                // シンボル
  value: number;                 // 評価額
  ratio: number;                 // 構成比（0-1）
  change24h?: number;            // 24時間変動額
  changePercent24h?: number;     // 24時間変動率
  amount?: number;               // 保有数量
  currentPrice?: number;         // 現在価格
}

// ポートフォリオ配分
export interface PortfolioAllocation {
  asset: string;                 // 資産名
  symbol: string;                // シンボル
  value: number;                 // 評価額
  percentage: number;            // 構成比（%）
  color: string;                 // チャート表示色
}

// ポートフォリオ統計
export interface PortfolioStats {
  totalValue: number;            // 総評価額
  totalInvested?: number;        // 総投資額
  totalGainLoss?: number;        // 総損益
  totalGainLossPercent?: number; // 総損益率
  diversificationScore?: number; // 分散度スコア（0-100）
  riskScore?: number;            // リスクスコア（0-100）
  assetCount: number;            // 保有資産数
  topAsset: AssetSummary;        // 最大保有資産
}

// ポートフォリオ履歴
export interface PortfolioHistory {
  date: string;                  // 日付
  totalValue: number;            // 総評価額
  totalChange: number;           // 変動額
  totalChangePercent: number;    // 変動率
  assets: AssetHistoryPoint[];   // 各資産の履歴
}

// 資産履歴ポイント
export interface AssetHistoryPoint {
  id: string;                    // 資産ID
  value: number;                 // 評価額
  price: number;                 // 価格
  amount: number;                // 数量
}

// ポートフォリオ設定
export interface PortfolioSettings {
  currency: 'JPY' | 'USD' | 'EUR'; // 表示通貨
  updateInterval: number;        // 更新間隔（分）
  notifications: {
    priceAlerts: boolean;        // 価格アラート
    portfolioAlerts: boolean;    // ポートフォリオアラート
    newsAlerts: boolean;         // ニュースアラート
  };
  display: {
    showPercentages: boolean;    // パーセンテージ表示
    showChanges: boolean;        // 変動表示
    chartType: 'pie' | 'donut' | 'bar'; // チャートタイプ
  };
}

// ポートフォリオ比較
export interface PortfolioComparison {
  current: PortfolioSummary;     // 現在のポートフォリオ
  previous: PortfolioSummary;    // 比較対象ポートフォリオ
  changes: {
    totalValue: number;          // 総評価額変動
    totalValuePercent: number;   // 総評価額変動率
    assetChanges: AssetChange[]; // 各資産の変動
  };
}

// 資産変動
export interface AssetChange {
  id: string;                    // 資産ID
  name: string;                  // 資産名
  symbol: string;                // シンボル
  valueChange: number;           // 評価額変動
  valueChangePercent: number;    // 評価額変動率
  ratioChange: number;           // 構成比変動
  status: 'increased' | 'decreased' | 'unchanged'; // 変動ステータス
}