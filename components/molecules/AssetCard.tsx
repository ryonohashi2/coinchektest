/**
 * 資産カードコンポーネント（Molecule）
 * 個別資産の情報を表示するカード
 */
import React from 'react';
import { formatCurrency, getChangeColor } from '../../lib/utils';

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    symbol: string;
    value: number;
    ratio: number;
    change24h?: number;
    changePercent24h?: number;
    amount?: number;
    currentPrice?: number;
  };
  onClick?: (assetId: string) => void;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onClick,
  showDetails = true,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const textSizeClasses = {
    sm: { title: 'text-sm', value: 'text-lg', detail: 'text-xs' },
    md: { title: 'text-base', value: 'text-xl', detail: 'text-sm' },
    lg: { title: 'text-lg', value: 'text-2xl', detail: 'text-base' },
  };

  const handleClick = () => {
    if (onClick) {
      onClick(asset.id);
    }
  };

  const changeColor = getChangeColor(asset.changePercent24h || 0);

  return (
    <div
      className={`
        relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-purple-900/80 to-slate-900/90 
        rounded-3xl border-2 border-amber-400/30 shadow-2xl hover:shadow-amber-500/25 
        transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${sizeClasses[size]}
        ${onClick ? 'cursor-pointer hover:border-amber-400 hover:shadow-amber-400/40' : ''}
        backdrop-blur-sm group
      `}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* アイコン（将来的に暗号資産アイコンを表示） */}
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-white font-bold text-lg drop-shadow-sm">
              {asset.symbol === 'BTC' ? '₿' : asset.symbol === 'ETH' ? 'Ξ' : asset.symbol?.charAt(0) || '💎'}
            </span>
          </div>
          
          <div>
            <h3 className={`font-bold text-amber-100 ${textSizeClasses[size].title} group-hover:text-amber-200 transition-colors`}>
              {asset.name}
            </h3>
            <p className="text-amber-300/70 text-xs uppercase tracking-widest font-medium">
              {asset.symbol}
            </p>
          </div>
        </div>

        {/* 構成比率 */}
        <div className="text-right">
          <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {(asset.ratio * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 評価額 */}
      <div className="mb-4">
        <p className={`font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent ${textSizeClasses[size].value} drop-shadow-sm`}>
          {formatCurrency(asset.value)}
        </p>
      </div>

      {/* 詳細情報 */}
      {showDetails && (
        <div className="space-y-3 bg-black/20 rounded-2xl p-4 backdrop-blur-sm border border-amber-400/20">
          {/* 24時間変動 */}
          {asset.changePercent24h !== undefined && (
            <div className="flex items-center justify-between">
              <span className={`text-amber-200/70 ${textSizeClasses[size].detail} font-medium`}>
                📈 24時間変動
              </span>
              <span className={`font-bold ${textSizeClasses[size].detail} ${
                asset.changePercent24h > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {asset.changePercent24h > 0 ? '+' : ''}
                {asset.changePercent24h.toFixed(2)}%
              </span>
            </div>
          )}

          {/* 保有数量 */}
          {asset.amount !== undefined && (
            <div className="flex items-center justify-between">
              <span className={`text-amber-200/70 ${textSizeClasses[size].detail} font-medium`}>
                💰 保有数量
              </span>
              <span className={`text-amber-100 ${textSizeClasses[size].detail} font-semibold`}>
                {asset.amount.toLocaleString()} {asset.symbol}
              </span>
            </div>
          )}

          {/* 現在価格 */}
          {asset.currentPrice !== undefined && (
            <div className="flex items-center justify-between">
              <span className={`text-amber-200/70 ${textSizeClasses[size].detail} font-medium`}>
                💎 現在価格
              </span>
              <span className={`text-amber-100 ${textSizeClasses[size].detail} font-semibold`}>
                {formatCurrency(asset.currentPrice)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* クリック可能な場合のインジケーター */}
      {onClick && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-center text-blue-600 text-sm">
            <span>詳細を見る</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetCard;