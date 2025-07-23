/**
 * 汎用ユーティリティ関数
 */

/**
 * 数値を通貨形式でフォーマット
 * @param value - フォーマットする数値
 * @param currency - 通貨コード (デフォルト: 'JPY')
 * @returns フォーマットされた通貨文字列
 */
export const formatCurrency = (value: number, currency: string = 'JPY'): string => {
  if (isNaN(value) || !isFinite(value)) {
    return '¥0';
  }
  
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * パーセンテージを計算
 * @param value - 値
 * @param total - 合計値
 * @returns パーセンテージ (0-100)
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100; // 小数点第2位まで
};

/**
 * 日付を読みやすい形式でフォーマット
 * @param date - フォーマットする日付
 * @param locale - ロケール (デフォルト: 'ja-JP')
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (date: Date | string, locale: string = 'ja-JP'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * 数値を省略形でフォーマット (例: 1,000,000 → 1M)
 * @param value - フォーマットする数値
 * @returns 省略形の文字列
 */
export const formatCompactNumber = (value: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

/**
 * 色の変化率に基づいて色を決定
 * @param changeRate - 変化率 (%)
 * @returns CSS色クラス名
 */
export const getChangeColor = (changeRate: number): string => {
  if (changeRate > 0) return 'text-green-600';
  if (changeRate < 0) return 'text-red-600';
  return 'text-gray-600';
};

/**
 * APIエラーハンドリング
 * @param error - エラーオブジェクト
 * @returns ユーザー向けエラーメッセージ
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * 深いオブジェクトのクローンを作成
 * @param obj - クローンするオブジェクト
 * @returns クローンされたオブジェクト
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 配列から重複を除去
 * @param array - 重複を除去する配列
 * @returns 重複が除去された配列
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};