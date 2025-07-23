/**
 * 共通型定義のエクスポート
 * 
 * このファイルから全ての型定義をインポートできます
 * 使用例: import { Asset, Portfolio, ApiResponse } from '../types';
 */

// 資産関連の型定義
export * from './asset';

// ポートフォリオ関連の型定義
export * from './portfolio';

// API関連の型定義
export * from './api';

// 型定義の再エクスポート（便利なエイリアス）
export type {
  // 基本型
  Asset,
  AssetDetail,
  PriceHistory,
  Portfolio,
  PortfolioSummary,
  
  // API型
  ApiResponse,
  CoincheckBalance,
  CoinGeckoMarketData,
  CoinGeckoPriceHistory,
  
  // 内部API型
  PortfolioSummaryApiResponse,
  AssetsApiResponse,
  AssetDetailApiResponse,
  ConnectionTestApiResponse,
} from './api';