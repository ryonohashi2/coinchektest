/**
 * CoinGecko API連携
 * 
 * 主要エンドポイント:
 * - GET /coins/markets: 市場データ取得
 * - GET /coins/{id}/market_chart: 価格推移取得
 * - GET /ping: API接続テスト
 * 
 * 認証: 無料枠はAPIキー不要、Pro版はAPIキー必要
 */
import { createApiClient, handleApiError, retryWithBackoff } from './api';
import { cachedApiCall, generateCacheKey } from './cache';
import type { CoinGeckoMarketData, CoinGeckoPriceHistory } from '../types/api';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

/**
 * CoinGecko APIクライアント
 */
class CoinGeckoAPI {
  private client;
  private apiKey?: string;

  constructor() {
    this.client = createApiClient(COINGECKO_API_BASE);
    this.apiKey = process.env.COINGECKO_API_KEY;
  }

  /**
   * APIキーが設定されている場合のヘッダー
   */
  private getHeaders(): Record<string, string> {
    return this.apiKey ? { 'x-cg-pro-api-key': this.apiKey } : {};
  }

  /**
   * 市場データ取得
   */
  async getMarketData(
    ids: string,
    vs_currency: string = 'jpy',
    order: string = 'market_cap_desc',
    per_page: number = 100,
    page: number = 1
  ): Promise<CoinGeckoMarketData[]> {
    const cacheKey = generateCacheKey('coingecko:markets', {
      ids,
      vs_currency,
      order,
      per_page,
      page,
    });

    return cachedApiCall(
      cacheKey,
      async () => {
        const response = await retryWithBackoff(() =>
          this.client.get('/coins/markets', {
            params: {
              ids,
              vs_currency,
              order,
              per_page,
              page,
              sparkline: false,
              price_change_percentage: '24h',
            },
            headers: this.getHeaders(),
          })
        );
        return response.data;
      },
      2 * 60 * 1000 // 2分キャッシュ
    ).catch((error) => {
      console.error('CoinGecko Market Data Error:', handleApiError(error));
      return this.getMockMarketData(ids);
    });
  }

  /**
   * 価格推移データ取得
   */
  async getMarketChart(
    id: string,
    vs_currency: string = 'jpy',
    days: number = 7
  ): Promise<CoinGeckoPriceHistory> {
    try {
      const response = await retryWithBackoff(() =>
        this.client.get(`/coins/${id}/market_chart`, {
          params: {
            vs_currency,
            days,
          },
          headers: this.getHeaders(),
        })
      );

      return response.data;
    } catch (error) {
      console.error('CoinGecko Market Chart Error:', handleApiError(error));
      // モックデータを返す
      return this.getMockMarketChart(id);
    }
  }

  /**
   * 単一コインの詳細データ取得
   */
  async getCoinData(
    id: string,
    localization: boolean = false,
    tickers: boolean = false,
    market_data: boolean = true,
    community_data: boolean = false,
    developer_data: boolean = false
  ): Promise<any> {
    try {
      const response = await retryWithBackoff(() =>
        this.client.get(`/coins/${id}`, {
          params: {
            localization,
            tickers,
            market_data,
            community_data,
            developer_data,
          },
          headers: this.getHeaders(),
        })
      );

      return response.data;
    } catch (error) {
      console.error('CoinGecko Coin Data Error:', handleApiError(error));
      throw error;
    }
  }

  /**
   * API接続テスト
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/ping', {
        headers: this.getHeaders(),
      });
      return response.data.gecko_says === '(V3) To the Moon!';
    } catch (error) {
      console.error('CoinGecko connection test failed:', handleApiError(error));
      return false;
    }
  }

  /**
   * 開発用モック市場データ
   */
  private getMockMarketData(ids: string): CoinGeckoMarketData[] {
    const mockData: Record<string, CoinGeckoMarketData> = {
      bitcoin: {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 2000000,
        market_cap: 39000000000000,
        market_cap_rank: 1,
        fully_diluted_valuation: 42000000000000,
        total_volume: 2500000000000,
        high_24h: 2050000,
        low_24h: 1950000,
        price_change_24h: 100000,
        price_change_percentage_24h: 5.2,
        market_cap_change_24h: 2000000000000,
        market_cap_change_percentage_24h: 5.4,
        circulating_supply: 19500000,
        total_supply: 21000000,
        max_supply: 21000000,
        ath: 2200000,
        ath_change_percentage: -9.1,
        ath_date: '2024-03-14T07:10:36.635Z',
        atl: 50000,
        atl_change_percentage: 3900000,
        atl_date: '2013-07-06T00:00:00.000Z',
        last_updated: '2024-07-22T12:00:00.000Z',
      },
      ethereum: {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 117283.5,
        market_cap: 14000000000000,
        market_cap_rank: 2,
        fully_diluted_valuation: 14000000000000,
        total_volume: 1200000000000,
        high_24h: 120000,
        low_24h: 115000,
        price_change_24h: -2500,
        price_change_percentage_24h: -2.1,
        market_cap_change_24h: -300000000000,
        market_cap_change_percentage_24h: -2.1,
        circulating_supply: 120000000,
        total_supply: 120000000,
        max_supply: null,
        ath: 150000,
        ath_change_percentage: -21.8,
        ath_date: '2021-11-10T14:24:19.604Z',
        atl: 1000,
        atl_change_percentage: 11628350,
        atl_date: '2015-10-20T00:00:00.000Z',
        last_updated: '2024-07-22T12:00:00.000Z',
      },
    };

    return ids.split(',').map(id => mockData[id.trim()]).filter(Boolean);
  }

  /**
   * 開発用モック価格推移データ
   */
  private getMockMarketChart(id: string): CoinGeckoPriceHistory {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const basePrice = id === 'bitcoin' ? 2000000 : 117283.5;
    const prices: [number, number][] = [];
    const market_caps: [number, number][] = [];
    const total_volumes: [number, number][] = [];

    for (let i = 6; i >= 0; i--) {
      const timestamp = now - (i * dayMs);
      const variation = (Math.random() - 0.5) * 0.1; // ±5%の変動
      const price = basePrice * (1 + variation);
      const marketCap = price * (id === 'bitcoin' ? 19500000 : 120000000);
      const volume = marketCap * 0.1;

      prices.push([timestamp, price]);
      market_caps.push([timestamp, marketCap]);
      total_volumes.push([timestamp, volume]);
    }

    return {
      prices,
      market_caps,
      total_volumes,
    };
  }
}

// シングルトンインスタンス
export const coinGeckoAPI = new CoinGeckoAPI();

// 便利関数のエクスポート
export const getMarketData = (ids: string, vs_currency?: string) =>
  coinGeckoAPI.getMarketData(ids, vs_currency);
export const getMarketChart = (id: string, vs_currency?: string, days?: number) =>
  coinGeckoAPI.getMarketChart(id, vs_currency, days);
export const getCoinData = (id: string) => coinGeckoAPI.getCoinData(id);
export const testCoinGeckoConnection = () => coinGeckoAPI.testConnection(); 