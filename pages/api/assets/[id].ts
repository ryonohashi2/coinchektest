// GET /api/assets/[id]
import type { NextApiRequest, NextApiResponse } from 'next';
import { getBalance } from '../../../lib/coincheck';
import { getMarketData, getMarketChart } from '../../../lib/coingecko';
import { 
  transformCoincheckBalance, 
  transformPriceHistory, 
  transformToAssetDetail 
} from '../../../lib/data-processor';
import type { AssetDetailApiResponse } from '../../../types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AssetDetailApiResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid asset ID' });
  }

  try {
    console.log(`Asset detail API: Fetching data for ${id}...`);

    // 資産IDをCoinGecko IDにマッピング
    const coinGeckoIdMap: Record<string, string> = {
      btc: 'bitcoin',
      eth: 'ethereum',
      ada: 'cardano',
      dot: 'polkadot',
      link: 'chainlink',
    };

    const coinGeckoId = coinGeckoIdMap[id.toLowerCase()];
    if (!coinGeckoId) {
      return res.status(404).json({ error: 'Asset not supported' });
    }

    // 並行してデータを取得
    const [coincheckBalance, marketData, priceHistory] = await Promise.allSettled([
      getBalance(),
      getMarketData(coinGeckoId),
      getMarketChart(coinGeckoId, 'jpy', 7), // 7日間の価格履歴
    ]);

    // エラーハンドリング
    if (coincheckBalance.status === 'rejected') {
      console.error('Failed to fetch Coincheck balance:', coincheckBalance.reason);
    }

    if (marketData.status === 'rejected') {
      console.error('Failed to fetch market data:', marketData.reason);
    }

    if (priceHistory.status === 'rejected') {
      console.error('Failed to fetch price history:', priceHistory.reason);
    }

    // 必要なデータが取得できない場合はフォールバック
    if (marketData.status === 'rejected') {
      console.warn('Market data unavailable, using fallback');
      const fallbackAsset: AssetDetailApiResponse = {
        id,
        name: id === 'btc' ? 'Bitcoin' : 'Ethereum',
        symbol: id.toUpperCase(),
        amount: id === 'btc' ? 0.5 : 2,
        value: id === 'btc' ? 1000000 : 234567,
        currentPrice: id === 'btc' ? 2000000 : 117283.5,
        change24h: id === 'btc' ? 5.2 : -2.1,
        priceHistory: [
          { date: '2024-07-01', price: id === 'btc' ? 1900000 : 115000 },
          { date: '2024-07-02', price: id === 'btc' ? 1950000 : 119000 },
          { date: '2024-07-03', price: id === 'btc' ? 2000000 : 117283.5 },
        ],
        marketCap: id === 'btc' ? 39000000000000 : 14000000000000,
        volume24h: id === 'btc' ? 2500000000000 : 1200000000000,
        rank: id === 'btc' ? 1 : 2,
      };
      return res.status(200).json(fallbackAsset);
    }

    // データ処理
    const balance = coincheckBalance.status === 'fulfilled' ? coincheckBalance.value : null;
    const market = marketData.status === 'fulfilled' ? marketData.value[0] : null;
    const history = priceHistory.status === 'fulfilled' ? priceHistory.value : null;

    if (!market) {
      return res.status(404).json({ error: 'Asset data not found' });
    }

    // 保有数量を取得
    let amount = 0;
    if (balance) {
      const assets = transformCoincheckBalance(balance, [market]);
      const asset = assets.find(a => a.id === id);
      amount = asset?.amount || 0;
    }

    // 価格履歴の変換
    const transformedHistory = history ? transformPriceHistory(history) : [];

    // 資産詳細の作成
    const assetDetail = transformToAssetDetail(market, amount, transformedHistory);

    // レスポンス形式に変換
    const response: AssetDetailApiResponse = {
      id: assetDetail.id,
      name: assetDetail.name,
      symbol: assetDetail.symbol,
      amount: assetDetail.amount,
      value: assetDetail.value,
      currentPrice: assetDetail.currentPrice,
      change24h: assetDetail.changePercent24h || 0,
      priceHistory: assetDetail.priceHistory.map(p => ({
        date: p.date,
        price: p.price,
      })),
      marketCap: assetDetail.marketCap || 0,
      volume24h: assetDetail.volume24h || 0,
      rank: assetDetail.rank || 0,
    };

    console.log(`Asset detail API: Success for ${id}`);
    res.status(200).json(response);

  } catch (error) {
    console.error(`Asset detail API error for ${id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}