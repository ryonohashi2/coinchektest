/**
 * APIレスポンスキャッシュ機能
 * メモリベースの簡易キャッシュシステム
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5分

  /**
   * キャッシュにデータを保存
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };
    
    this.cache.set(key, entry);
    
    // TTL後に自動削除
    setTimeout(() => {
      this.cache.delete(key);
    }, entry.ttl);
  }

  /**
   * キャッシュからデータを取得
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // TTLチェック
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * キャッシュの存在確認
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // TTLチェック
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * キャッシュを削除
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * 全キャッシュをクリア
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * キャッシュサイズを取得
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 期限切れキャッシュを手動でクリーンアップ
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

// シングルトンインスタンス
export const apiCache = new MemoryCache();

/**
 * キャッシュキー生成ヘルパー
 */
export const generateCacheKey = (prefix: string, params: Record<string, any>): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${prefix}:${sortedParams}`;
};

/**
 * キャッシュ付きAPI呼び出しヘルパー
 */
export async function cachedApiCall<T>(
  cacheKey: string,
  apiCall: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // キャッシュから取得を試行
  const cached = apiCache.get<T>(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return cached;
  }

  // キャッシュミス時はAPI呼び出し
  console.log(`Cache miss: ${cacheKey}`);
  try {
    const result = await apiCall();
    apiCache.set(cacheKey, result, ttl);
    return result;
  } catch (error) {
    console.error(`API call failed for ${cacheKey}:`, error);
    throw error;
  }
}

/**
 * 定期的なキャッシュクリーンアップ
 */
if (typeof window === 'undefined') {
  // サーバーサイドでのみ実行
  setInterval(() => {
    apiCache.cleanup();
  }, 10 * 60 * 1000); // 10分ごと
}