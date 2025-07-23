/**
 * データ変換・正規化ロジック
 * 外部APIから取得したデータを内部形式に変換
 */

import type {
  CoincheckBalance,
  CoinGeckoMarketData,
  CoinGeckoPriceHistory
} from '../types/api';
import type {
  Asset,
  AssetDetail,
  PriceHistory,
  PortfolioSummary
} from '../types';

/**
 * Coincheck残高データを資産配列に変換
 */
export function transformCoincheckBalance(
  balance: CoincheckBalance,
  marketData: CoinGeckoMarketData[]
): Asset[] {
  const assets: Asset[] = [];

  // 暗号資産の変換マッピング
  const cryptoMapping: Record<string, string> = {
    btc: 'bitcoin',
    eth: 'ethereum',
    // 他の通貨も必要に応じて追加
  };

  // 各暗号資産の処理
  Object.entries(balance).forEach(([symbol, amountStr]) => {
    if (symbol === 'success' || symbol === 'jpy') return;

    const amount = parseFloat(amountStr);
    if (amount <= 0) return;

    const coinGeckoId = cryptoMapping[symbol];
    const marketInfo = marketData.find(coin => coin.id === coinGeckoId);

    if (marketInfo) {
      const currentPrice = marketInfo.current_price;
      const value = amount * currentPrice;

      assets.push({
        id: symbol,
        name: marketInfo.name,
        symbol: symbol.toUpperCase(),
        amount,
        value,
        currentPrice,
        change24h: marketInfo.price_change_24h,
        changePercent24h: marketInfo.price_change_percentage_24h,
      });
    }
  });

  return assets;
}

/**
 * CoinGecko価格履歴をPriceHistory配列に変換
 */
export function transformPriceHistory(
  coinGeckoHistory: CoinGeckoPriceHistory
): PriceHistory[] {
  return coinGeckoHistory.prices.map(([timestamp, price], index) => ({
    date: new Date(timestamp).toISOString(),
    price,
    volume: coinGeckoHistory.total_volumes[index]?.[1],
    marketCap: coinGeckoHistory.market_caps[index]?.[1],
  }));
}

/**
 * 資産配列からポートフォリオサマリーを生成
 */
export function generatePortfolioSummary(assets: Asset[]): PortfolioSummary {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const assetSummaries = assets.map(asset => ({
    id: asset.id,
    name: asset.name,
    symbol: asset.symbol,
    value: asset.value,
    ratio: totalValue > 0 ? asset.value / totalValue : 0,
    change24h: asset.change24h,
    changePercent24h: asset.changePercent24h,
    amount: asset.amount,
    currentPrice: asset.currentPrice,
  }));

  return {
    totalValue,
    totalChange24h: assets.reduce((sum, asset) => sum + (asset.change24h || 0) * asset.amount, 0),
    totalChangePercent24h: calculateWeightedAverageChange(assets),
    assets: assetSummaries,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * 加重平均変動率を計算
 */
function calculateWeightedAverageChange(assets: Asset[]): number {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  if (totalValue === 0) return 0;

  const weightedSum = assets.reduce((sum, asset) => {
    const weight = asset.value / totalValue;
    const change = asset.changePercent24h || 0;
    return sum + (weight * change);
  }, 0);

  return weightedSum;
}

/**
 * CoinGecko市場データを資産詳細に変換
 */
export function transformToAssetDetail(
  marketData: CoinGeckoMarketData,
  amount: number,
  priceHistory: PriceHistory[]
): AssetDetail {
  const value = amount * marketData.current_price;

  return {
    id: marketData.symbol,
    name: marketData.name,
    symbol: marketData.symbol.toUpperCase(),
    amount,
    value,
    currentPrice: marketData.current_price,
    change24h: marketData.price_change_24h,
    changePercent24h: marketData.price_change_percentage_24h,
    priceHistory,
    marketCap: marketData.market_cap,
    volume24h: marketData.total_volume,
    rank: marketData.market_cap_rank,
    supply: {
      circulating: marketData.circulating_supply,
      total: marketData.total_supply || marketData.circulating_supply,
      max: marketData.max_supply || undefined,
    },
    ath: {
      value: marketData.ath,
      date: marketData.ath_date,
      changePercentage: marketData.ath_change_percentage,
    },
    atl: {
      value: marketData.atl,
      date: marketData.atl_date,
      changePercentage: marketData.atl_change_percentage,
    },
    lastUpdated: marketData.last_updated,
  };
}

/**
 * データの妥当性チェック
 */
export function validateAssetData(asset: Asset): boolean {
  return (
    typeof asset.id === 'string' &&
    typeof asset.name === 'string' &&
    typeof asset.symbol === 'string' &&
    typeof asset.amount === 'number' &&
    typeof asset.value === 'number' &&
    typeof asset.currentPrice === 'number' &&
    asset.amount >= 0 &&
    asset.value >= 0 &&
    asset.currentPrice >= 0
  );
}

/**
 * エラー時のフォールバックデータ生成
 */
export function generateFallbackPortfolio(): PortfolioSummary {
  const mockAssets = [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      value: 1000000,
      ratio: 0.6,
      change24h: 100000,
      changePercent24h: 5.2,
      amount: 0.5,
      currentPrice: 2000000,
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      value: 666667,
      ratio: 0.4,
      change24h: -5000,
      changePercent24h: -2.1,
      amount: 2,
      currentPrice: 333333.5,
    },
  ];

  return {
    totalValue: 1666667,
    totalChange24h: 95000,
    totalChangePercent24h: 2.4,
    assets: mockAssets,
    lastUpdated: new Date().toISOString(),
  };
}