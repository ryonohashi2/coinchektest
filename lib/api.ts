/**
 * API呼び出し共通ロジック
 */
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '../types/api';

/**
 * 共通APIクライアントの作成
 */
export const createApiClient = (baseURL: string, timeout: number = 10000): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // リクエストインターセプター
  client.interceptors.request.use(
    (config) => {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // レスポンスインターセプター
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error: AxiosError) => {
      console.error('API Response Error:', error.response?.status, error.message);
      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * APIエラーハンドリング
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // サーバーエラー
      return `API Error: ${error.response.status} - ${error.response.data?.message || error.message}`;
    } else if (error.request) {
      // ネットワークエラー
      return 'Network Error: Unable to reach the server';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * APIレスポンスの検証
 */
export const validateApiResponse = <T>(response: AxiosResponse): ApiResponse<T> => {
  if (response.status >= 200 && response.status < 300) {
    return {
      success: true,
      data: response.data,
    };
  } else {
    return {
      success: false,
      error: `HTTP ${response.status}: ${response.statusText}`,
    };
  }
};

/**
 * レート制限対応のリトライ機能
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (i === maxRetries) break;
      
      // 指数バックオフ
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}; 