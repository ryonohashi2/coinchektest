'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { PortfolioSummary } from '../components/organisms/PortfolioSummary';
import { AssetCard } from '../components/molecules/AssetCard';
import { PortfolioPieChart } from '../components/charts/PortfolioPieChart';
import { ChartContainer } from '../components/charts/ChartContainer';
import type { PortfolioSummaryApiResponse } from '../types/api';

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<PortfolioSummaryApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ポートフォリオデータの取得
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio-summary');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPortfolioData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch portfolio data:', err);
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // 資産カードクリック時の処理
  const handleAssetClick = (assetId: string) => {
    window.location.href = `/assets/${assetId}`;
  };

  return (
    <DashboardLayout title="💎 Luxury Portfolio Dashboard 💎">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-yellow-400/5"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #fbbf24 1px, transparent 1px), radial-gradient(circle at 75% 75%, #f59e0b 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            backgroundPosition: '0 0, 25px 25px'
          }}></div>
        </div>
        <div className="relative space-y-12 p-8">
          {/* ページヘッダー */}
          <div className="text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 rounded-3xl backdrop-blur-sm border border-amber-300/30"></div>
            <div className="relative py-12 px-8">
              <div className="mb-4">
                <span className="text-6xl animate-pulse">💎</span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                LUXURY PORTFOLIO
              </h1>
              <p className="text-amber-100 text-xl font-medium mb-6">
                あなたの資産を最高級の体験で管理
              </p>
              <div className="flex justify-center space-x-2">
                <div className="h-1 w-8 bg-gradient-to-r from-amber-300 to-yellow-300 rounded-full animate-pulse"></div>
                <div className="h-1 w-16 bg-gradient-to-r from-yellow-300 to-amber-300 rounded-full"></div>
                <div className="h-1 w-8 bg-gradient-to-r from-amber-300 to-yellow-300 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* ローディング状態 */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500 absolute top-0 left-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-amber-600 text-xl">💰</span>
                </div>
              </div>
              <span className="ml-4 text-amber-700 font-semibold text-lg">プレミアムデータを読み込み中...</span>
            </div>
          )}

          {/* エラー状態 */}
          {error && (
            <div className="relative overflow-hidden bg-gradient-to-br from-red-900/80 via-red-800/70 to-red-900/80 rounded-3xl border-2 border-red-400/30 shadow-2xl backdrop-blur-sm p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-600/10"></div>
              <div className="relative">
                <div className="text-red-300 mb-4">
                  <span className="text-5xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-200 to-red-300 bg-clip-text text-transparent mb-3">
                  データの読み込みに失敗しました
                </h3>
                <p className="text-red-200/80 mb-6 text-lg">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                >
                  🔄 再読み込み
                </button>
              </div>
            </div>
          )}

          {/* メインコンテンツ */}
          {!loading && !error && portfolioData && (
            <>
              {/* ポートフォリオサマリー */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左側：サマリー情報 */}
                <div className="lg:col-span-1">
                  <PortfolioSummary data={portfolioData} />
                </div>

                {/* 右側：ドーナツチャート */}
                <div className="lg:col-span-2">
                  <ChartContainer
                    title="資産構成比率"
                    height={400}
                  >
                    <PortfolioPieChart assets={portfolioData.assets} />
                  </ChartContainer>
                </div>
              </div>

              {/* 資産一覧 */}
              <div className="relative">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full px-8 py-4 border border-amber-400/30 backdrop-blur-sm">
                    <span className="text-4xl animate-bounce">👑</span>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
                      プレミアム資産コレクション
                    </h2>
                    <span className="text-4xl animate-bounce">👑</span>
                  </div>
                  <p className="text-amber-200/70 mt-4 text-lg">あなたの富の源泉</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {portfolioData.assets.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      onClick={handleAssetClick}
                      showDetails={true}
                    />
                  ))}
                </div>
              </div>

              {/* 統計情報 */}
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-purple-900/80 to-slate-900/90 rounded-3xl border-2 border-amber-400/30 shadow-2xl backdrop-blur-sm p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-yellow-500/10"></div>
                <div className="relative">
                  <div className="text-center mb-8">
                    <span className="text-5xl mb-4 block animate-pulse">💰</span>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent mb-3">
                      ウェルス サマリー
                    </h3>
                    <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full mx-auto"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center group">
                      <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-3xl p-8 border border-amber-400/30 backdrop-blur-sm shadow-xl transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500">
                        <div className="text-amber-300 mb-4">
                          <span className="text-4xl">🏆</span>
                        </div>
                        <p className="text-4xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent mb-2">
                          {portfolioData.assets.length}
                        </p>
                        <p className="text-amber-200/80 font-semibold text-lg">プレミアム銘柄</p>
                      </div>
                    </div>
                    <div className="text-center group">
                      <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-3xl p-8 border border-emerald-400/30 backdrop-blur-sm shadow-xl transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500">
                        <div className="text-emerald-300 mb-4">
                          <span className="text-4xl">💎</span>
                        </div>
                        <p className="text-4xl font-bold bg-gradient-to-r from-emerald-200 to-green-200 bg-clip-text text-transparent mb-2">
                          ¥{portfolioData.totalValue.toLocaleString()}
                        </p>
                        <p className="text-emerald-200/80 font-semibold text-lg">総資産価値</p>
                      </div>
                    </div>
                    <div className="text-center group">
                      <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl p-8 border border-purple-400/30 backdrop-blur-sm shadow-xl transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500">
                        <div className="text-purple-300 mb-4">
                          <span className="text-4xl">👑</span>
                        </div>
                        <p className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent mb-2">
                          {portfolioData.assets.length > 0
                            ? Math.max(...portfolioData.assets.map(a => a.ratio * 100)).toFixed(1)
                            : '0'
                          }%
                        </p>
                        <p className="text-purple-200/80 font-semibold text-lg">最大保有比率</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
