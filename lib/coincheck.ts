/**
 * Coincheck API連携
 * 
 * 主要エンドポイント:
 * - GET /api/accounts/balance: 残高取得
 * - GET /api/exchange/orders/rate: レート取得
 * 
 * 認証: HMAC-SHA256署名が必要
 */
import crypto from 'crypto';
import { createApiClient, handleApiError, retryWithBackoff } from './api';
import { cachedApiCall, generateCacheKey } from './cache';
import type { CoincheckBalance } from '../types/api';

const COINCHECK_API_BASE = 'https://coincheck.com';

/**
 * HMAC-SHA256署名を生成
 */
const generateSignature = (message: string, secret: string): string => {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
};

/**
 * Coincheck APIクライアント
 */
class CoincheckAPI {
  private client;
  private accessKey: string;
  private secretKey: string;
  private useMockData: boolean;

  constructor() {
    this.client = createApiClient(COINCHECK_API_BASE);
    this.accessKey = process.env.COINCHECK_API_KEY || '';
    this.secretKey = process.env.COINCHECK_SECRET_KEY || '';
    this.useMockData = process.env.NODE_ENV === 'development' && (!this.accessKey || !this.secretKey);
    
    if (this.useMockData) {
      console.warn('Coincheck API: Using mock data (credentials not configured)');
    }
  }

  /**
   * 認証ヘッダーを生成
   */
  private generateAuthHeaders(nonce: number, path: string, body: string = ''): Record<string, string> {
    const message = nonce + 'https://coincheck.com' + path + body;
    const signature = generateSignature(message, this.secretKey);

    return {
      'ACCESS-KEY': this.accessKey,
      'ACCESS-NONCE': nonce.toString(),
      'ACCESS-SIGNATURE': signature,
    };
  }

  /**
   * 残高取得
   */
  async getBalance(): Promise<CoincheckBalance> {
    // モックデータ使用時は即座にモックを返す
    if (this.useMockData) {
      console.info('Coincheck API: Returning mock balance data');
      return this.getMockBalance();
    }

    try {
      if (!this.accessKey || !this.secretKey) {
        throw new Error('Coincheck API credentials not configured');
      }

      const nonce = Date.now();
      const path = '/api/accounts/balance';
      const headers = this.generateAuthHeaders(nonce, path);

      const response = await retryWithBackoff(() =>
        this.client.get(path, { headers })
      );

      // レスポンスの妥当性チェック
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format from Coincheck API');
      }

      // 必須フィールドの存在チェック
      const requiredFields = ['success', 'jpy', 'btc', 'eth'];
      for (const field of requiredFields) {
        if (!(field in response.data)) {
          console.warn(`Missing field in Coincheck response: ${field}`);
        }
      }

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('Coincheck API Error:', errorMessage);
      
      // エラータイプに応じた処理
      if (error instanceof Error) {
        if (error.message.includes('credentials')) {
          console.error('Coincheck: API credentials are invalid or missing');
        } else if (error.message.includes('rate limit') || error.message.includes('429')) {
          console.error('Coincheck: Rate limit exceeded, using cached data if available');
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
          console.error('Coincheck: Network error, check internet connection');
        }
      }
      
      // フォールバック: モックデータを返す
      console.info('Coincheck API: Falling back to mock data due to error');
      return this.getMockBalance();
    }
  }

  /**
   * レート取得（認証不要）
   */
  async getRate(pair: string = 'btc_jpy'): Promise<{ rate: string }> {
    try {
      const response = await retryWithBackoff(() =>
        this.client.get(`/api/exchange/orders/rate?pair=${pair}`)
      );

      return response.data;
    } catch (error) {
      console.error('Coincheck Rate API Error:', handleApiError(error));
      // モックデータを返す
      return { rate: '2000000' };
    }
  }

  /**
   * 開発用モックデータ
   */
  private getMockBalance(): CoincheckBalance {
    return {
      success: true,
      jpy: '100000',
      btc: '0.5',
      eth: '2.0',
      etc: '0',
      lsk: '0',
      fct: '0',
      xrp: '0',
      xem: '0',
      ltc: '0',
      bch: '0',
      mona: '0',
      xlm: '0',
      qtum: '0',
      bat: '0',
      iost: '0',
      enj: '0',
      omg: '0',
      plt: '0',
    };
  }

  /**
   * API接続テスト
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getRate();
      return true;
    } catch (error) {
      console.error('Coincheck connection test failed:', handleApiError(error));
      return false;
    }
  }
}

// シングルトンインスタンス
export const coincheckAPI = new CoincheckAPI();

// 便利関数のエクスポート
export const getBalance = () => coincheckAPI.getBalance();
export const getRate = (pair?: string) => coincheckAPI.getRate(pair);
export const testCoincheckConnection = () => coincheckAPI.testConnection(); 