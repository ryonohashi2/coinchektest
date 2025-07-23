// GET /api/test-connections
import type { NextApiRequest, NextApiResponse } from 'next';
import { testCoincheckConnection } from '../../lib/coincheck';
import { testCoinGeckoConnection } from '../../lib/coingecko';

interface ConnectionTestResult {
  service: string;
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

interface TestConnectionsResponse {
  overall: 'success' | 'partial' | 'error';
  results: ConnectionTestResult[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestConnectionsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      overall: 'error',
      results: [
        {
          service: 'API',
          status: 'error',
          message: 'Method not allowed',
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }

  const results: ConnectionTestResult[] = [];
  const timestamp = new Date().toISOString();

  // CoinGecko接続テスト
  try {
    const coinGeckoStatus = await testCoinGeckoConnection();
    results.push({
      service: 'CoinGecko',
      status: coinGeckoStatus ? 'success' : 'error',
      message: coinGeckoStatus 
        ? 'Connection successful' 
        : 'Connection failed - API may be unavailable',
      timestamp,
    });
  } catch (error) {
    results.push({
      service: 'CoinGecko',
      status: 'error',
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp,
    });
  }

  // Coincheck接続テスト
  try {
    const coincheckStatus = await testCoincheckConnection();
    results.push({
      service: 'Coincheck',
      status: coincheckStatus ? 'success' : 'error',
      message: coincheckStatus 
        ? 'Connection successful' 
        : 'Connection failed - Check API credentials or service availability',
      timestamp,
    });
  } catch (error) {
    results.push({
      service: 'Coincheck',
      status: 'error',
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp,
    });
  }

  // 全体ステータスの判定
  const successCount = results.filter(r => r.status === 'success').length;
  const overall = successCount === results.length 
    ? 'success' 
    : successCount > 0 
    ? 'partial' 
    : 'error';

  res.status(200).json({
    overall,
    results,
  });
}