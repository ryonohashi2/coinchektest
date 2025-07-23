/**
 * API Routes用のミドルウェア
 * CORS、レート制限、レスポンス形式統一
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// レート制限用の簡易ストレージ
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * CORS設定
 */
export function corsMiddleware(req: NextApiRequest, res: NextApiResponse) {
  // 開発環境では全てのオリジンを許可
  const allowedOrigins = process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://127.0.0.1:3000']
    : [process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24時間

  // プリフライトリクエストの処理
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // 処理終了を示す
  }

  return false;
}

/**
 * レート制限ミドルウェア
 */
export function rateLimitMiddleware(
  req: NextApiRequest, 
  res: NextApiResponse,
  limit: number = 100, // 1時間あたりのリクエスト数
  windowMs: number = 60 * 60 * 1000 // 1時間
): boolean {
  const clientId = getClientId(req);
  const now = Date.now();
  const windowStart = now - windowMs;

  // 古いエントリをクリーンアップ
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }

  const clientData = rateLimitStore.get(clientId);
  
  if (!clientData) {
    // 新しいクライアント
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (clientData.resetTime < now) {
    // ウィンドウがリセット
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (clientData.count >= limit) {
    // レート制限に達した
    res.status(429).json({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${Math.ceil((clientData.resetTime - now) / 1000)} seconds.`,
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
    });
    return true;
  }

  // カウントを増加
  clientData.count++;
  return false;
}

/**
 * クライアントIDを取得（IPアドレスベース）
 */
function getClientId(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : req.connection.remoteAddress || 'unknown';
  
  return `ip:${ip}`;
}

/**
 * エラーレスポンスの統一
 */
export function sendErrorResponse(
  res: NextApiResponse,
  statusCode: number,
  message: string,
  details?: any
) {
  res.status(statusCode).json({
    error: getErrorName(statusCode),
    message,
    details,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 成功レスポンスの統一
 */
export function sendSuccessResponse<T>(
  res: NextApiResponse,
  data: T,
  statusCode: number = 200
) {
  res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * ステータスコードからエラー名を取得
 */
function getErrorName(statusCode: number): string {
  const errorNames: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };

  return errorNames[statusCode] || 'Unknown Error';
}

/**
 * リクエストバリデーション
 */
export function validateRequest(
  req: NextApiRequest,
  allowedMethods: string[]
): { isValid: boolean; error?: string } {
  if (!req.method || !allowedMethods.includes(req.method)) {
    return {
      isValid: false,
      error: `Method ${req.method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
    };
  }

  return { isValid: true };
}

/**
 * APIミドルウェアの統合ラッパー
 */
export function withApiMiddleware(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void,
  options: {
    allowedMethods?: string[];
    rateLimit?: { limit: number; windowMs: number };
    cors?: boolean;
  } = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // CORS処理
      if (options.cors !== false) {
        const isOptionsRequest = corsMiddleware(req, res);
        if (isOptionsRequest) return;
      }

      // メソッドバリデーション
      if (options.allowedMethods) {
        const validation = validateRequest(req, options.allowedMethods);
        if (!validation.isValid) {
          return sendErrorResponse(res, 405, validation.error!);
        }
      }

      // レート制限
      if (options.rateLimit) {
        const isRateLimited = rateLimitMiddleware(
          req, 
          res, 
          options.rateLimit.limit, 
          options.rateLimit.windowMs
        );
        if (isRateLimited) return;
      }

      // メインハンドラーの実行
      await handler(req, res);

    } catch (error) {
      console.error('API Middleware Error:', error);
      sendErrorResponse(res, 500, 'Internal server error');
    }
  };
}