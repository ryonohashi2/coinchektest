/**
 * ポートフォリオサマリーコンポーネント
 */
import React from 'react';
import { formatCurrency, calculatePercentage } from '../../lib/utils';
import type { PortfolioSummaryApiResponse } from '../../types/api';

interface PortfolioSummaryProps {
  data: PortfolioSummaryApiResponse;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ data }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-purple-900/80 to-slate-900/90 rounded-3xl border-2 border-amber-400/30 shadow-2xl backdrop-blur-sm p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-yellow-500/10"></div>
      <div className="relative">
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 block">👑</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
            ポートフォリオ サマリー
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full mx-auto mt-2"></div>
        </div>
      
        <div className="mb-8 text-center">
          <p className="text-amber-200/70 text-sm font-medium mb-2">💰 総評価額</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-lg">
            {formatCurrency(data.totalValue)}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-200 text-center mb-6">✨ 資産構成 ✨</h3>
          {data.assets.map((asset, index) => (
            <div key={asset.id} className="bg-black/20 rounded-2xl p-4 border border-amber-400/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-4 shadow-lg ${
                    index === 0 ? 'bg-gradient-to-r from-amber-400 to-yellow-400' :
                    index === 1 ? 'bg-gradient-to-r from-emerald-400 to-green-400' :
                    index === 2 ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                    'bg-gradient-to-r from-blue-400 to-cyan-400'
                  }`}></div>
                  <div>
                    <p className="text-sm font-bold text-amber-100">{asset.name}</p>
                    <p className="text-xs text-amber-300/70 uppercase tracking-wider">{asset.symbol || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-100">
                    {formatCurrency(asset.value)}
                  </p>
                  <p className="text-xs text-amber-300/70 font-medium">
                    {calculatePercentage(asset.value, data.totalValue)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;