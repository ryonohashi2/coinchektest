/**
 * チャート共通コンテナコンポーネント
 * ローディング・エラー状態を含むチャートラッパー
 */
import React from 'react';

interface ChartContainerProps {
  title?: string;
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  height?: number;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  loading = false,
  error = null,
  children,
  height = 300,
  className = '',
}) => {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-purple-900/80 to-slate-900/90 rounded-3xl border-2 border-amber-400/30 shadow-2xl backdrop-blur-sm ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-yellow-500/10"></div>
      {/* ヘッダー */}
      {title && (
        <div className="relative px-8 py-6 border-b border-amber-400/20">
          <div className="text-center">
            <span className="text-3xl mb-2 block">📊</span>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">{title}</h3>
            <div className="h-0.5 w-16 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full mx-auto mt-2"></div>
          </div>
        </div>
      )}

      {/* チャートコンテンツ */}
      <div className="p-6">
        <div style={{ height: `${height}px` }} className="relative">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}
          {!loading && !error && children}
        </div>
      </div>
    </div>
  );
};

/**
 * ローディング状態コンポーネント
 */
const LoadingState: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
    <div className="flex flex-col items-center space-y-3">
      {/* スピナー */}
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 text-sm">チャートを読み込み中...</p>
    </div>
  </div>
);

/**
 * エラー状態コンポーネント
 */
const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
    <div className="flex flex-col items-center space-y-3 text-center max-w-sm">
      {/* エラーアイコン */}
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      
      <div>
        <p className="text-gray-900 font-medium mb-1">チャートの読み込みに失敗しました</p>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
      
      {/* リトライボタン */}
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
      >
        再読み込み
      </button>
    </div>
  </div>
);

/**
 * 空データ状態コンポーネント
 */
export const EmptyChartState: React.FC<{ message?: string }> = ({ 
  message = "表示するデータがありません" 
}) => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
    <div className="flex flex-col items-center space-y-3 text-center">
      {/* 空状態アイコン */}
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  </div>
);

export default ChartContainer;