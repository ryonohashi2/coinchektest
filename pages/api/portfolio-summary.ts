// GET /api/portfolio-summary
import type { NextApiRequest, NextApiResponse } from 'next';
import { getBalance } from '../../lib/coincheck';
import { getMarketData } from '../../lib/coingecko';
import {
  transformCoincheckBalance,
  generatePortfolioSummary,
  generateFallbackPortfolio
} from '../../lib/data-processor';
import type { PortfolioSummaryApiResponse } from '../../types/api';
import type { AssetSummary } from '../../types/portfolio';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PortfolioSummaryApiResponse | { error: string }>
) {
  // GET メソッドのみ許可
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Portfolio summary API: Starting data fetch...');

    // 並行してデータを取得
    const [coincheckBalance, coinGeckoMarketData] = await Promise.allSettled([
      getBalance(),
      getMarketData('bitcoin,ethereum'), // 主要通貨のみ
    ]);

    // Coincheck残高データの処理
    if (coincheckBalance.status === 'rejected') {
      console.error('Failed to fetch Coincheck balance:', coincheckBalance.reason);
    }

    // CoinGecko市場データの処理
    if (coinGeckoMarketData.status === 'rejected') {
      console.error('Failed to fetch CoinGecko market data:', coinGeckoMarketData.reason);
    }

    // データが両方とも失敗した場合はフォールバック
    if (coincheckBalance.status === 'rejected' && coinGeckoMarketData.status === 'rejected') {
      console.warn('Both APIs failed, using fallback data');
      const fallbackPortfolio = generateFallbackPortfolio();
      return res.status(200).json({
        totalValue: fallbackPortfolio.totalValue,
        assets: fallbackPortfolio.assets.map((asset: AssetSummary) => ({
          id: asset.id,
          name: asset.name,
          symbol: asset.symbol,
          value: asset.value,
          ratio: asset.ratio,
        })),
      });
    }

    // データ変換処理
    const balance = coincheckBalance.status === 'fulfilled' ? coincheckBalance.value : null;
    const marketData = coinGeckoMarketData.status === 'fulfilled' ? coinGeckoMarketData.value : [];

    if (!balance || !marketData.length) {
      console.warn('Insufficient data, using fallback');
      const fallbackPortfolio = generateFallbackPortfolio();
      return res.status(200).json({
        totalValue: fallbackPortfolio.totalValue,
        assets: fallbackPortfolio.assets.map((asset: AssetSummary) => ({
          id: asset.id,
          name: asset.name,
          symbol: asset.symbol,
          value: asset.value,
          ratio: asset.ratio,
        })),
      });
    }

    // 資産データの変換と集計
    const assets = transformCoincheckBalance(balance, marketData);
    const portfolioSummary = generatePortfolioSummary(assets);

    // レスポンス形式に変換
    const response: PortfolioSummaryApiResponse = {
      totalValue: portfolioSummary.totalValue,
      assets: portfolioSummary.assets.map((asset: AssetSummary) => ({
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        value: asset.value,
        ratio: asset.ratio,
      })),
    };

    console.log(`Portfolio summary API: Success (${assets.length} assets, total: ¥${portfolioSummary.totalValue.toLocaleString()})`);

    res.status(200).json(response);

  } catch (error) {
    console.error('Portfolio summary API error:', error);

    // エラー時はフォールバックデータを返す
    const fallbackPortfolio = generateFallbackPortfolio();
    res.status(200).json({
      totalValue: fallbackPortfolio.totalValue,
      assets: fallbackPortfolio.assets.map((asset: AssetSummary) => ({
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        value: asset.value,
        ratio: asset.ratio,
      })),
    });
  }
} 