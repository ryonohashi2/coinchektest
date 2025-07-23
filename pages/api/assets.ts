// GET /api/assets
import type { NextApiRequest, NextApiResponse } from 'next';
import { getBalance } from '../../lib/coincheck';
import { getMarketData } from '../../lib/coingecko';
import { transformCoincheckBalance, validateAssetData } from '../../lib/data-processor';
import type { AssetsApiResponse } from '../../types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AssetsApiResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Assets API: Starting data fetch...');

    // 並行してデータを取得
    const [coincheckBalance, coinGeckoMarketData] = await Promise.allSettled([
      getBalance(),
      getMarketData('bitcoin,ethereum,cardano,polkadot,chainlink'), // より多くの通貨をサポート
    ]);

    // エラーハンドリング
    if (coincheckBalance.status === 'rejected') {
      console.error('Failed to fetch Coincheck balance:', coincheckBalance.reason);
    }

    if (coinGeckoMarketData.status === 'rejected') {
      console.error('Failed to fetch CoinGecko market data:', coinGeckoMarketData.reason);
    }

    // 両方のAPIが失敗した場合はフォールバックデータ
    if (coincheckBalance.status === 'rejected' && coinGeckoMarketData.status === 'rejected') {
      console.warn('Both APIs failed, returning fallback assets data');
      const fallbackAssets: AssetsApiResponse = [
        {
          id: 'btc',
          name: 'Bitcoin',
          symbol: 'BTC',
          amount: 0.5,
          value: 1000000,
          currentPrice: 2000000,
          change24h: 5.2,
        },
        {
          id: 'eth',
          name: 'Ethereum',
          symbol: 'ETH',
          amount: 2,
          value: 234567,
          currentPrice: 117283.5,
          change24h: -2.1,
        },
      ];
      return res.status(200).json(fallbackAssets);
    }

    // データ変換処理
    const balance = coincheckBalance.status === 'fulfilled' ? coincheckBalance.value : null;
    const marketData = coinGeckoMarketData.status === 'fulfilled' ? coinGeckoMarketData.value : [];

    if (!balance || !marketData.length) {
      console.warn('Insufficient data for assets API');
      return res.status(200).json([]);
    }

    // 資産データの変換
    const assets = transformCoincheckBalance(balance, marketData);
    
    // データ検証
    const validAssets = assets.filter(validateAssetData);
    
    // レスポンス形式に変換
    const response: AssetsApiResponse = validAssets.map(asset => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      amount: asset.amount,
      value: asset.value,
      currentPrice: asset.currentPrice,
      change24h: asset.changePercent24h || 0,
    }));

    console.log(`Assets API: Success (${response.length} assets)`);
    res.status(200).json(response);

  } catch (error) {
    console.error('Assets API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}