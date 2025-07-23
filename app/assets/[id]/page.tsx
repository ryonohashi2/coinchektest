'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '../../../components/templates/DashboardLayout';
import { ChartContainer } from '../../../components/charts/ChartContainer';
import { formatCurrency, formatDate, getChangeColor } from '../../../lib/utils';
import type { AssetDetailApiResponse } from '../../../types/api';

export default function AssetDetailPage() {
    const params = useParams();
    const router = useRouter();
    const assetId = params?.id as string;

    const [assetData, setAssetData] = useState<AssetDetailApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 資産詳細データの取得
    useEffect(() => {
        const fetchAssetData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/assets/${assetId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setAssetData(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch asset data:', err);
                setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        if (assetId) {
            fetchAssetData();
        }
    }, [assetId]);

    // 戻るボタンの処理
    const handleBack = () => {
        router.back();
    };

    return (
        <DashboardLayout title={`${assetData?.name || assetId} - 資産詳細`}>
            <div className="space-y-6">
                {/* 戻るボタン */}
                <button
                    onClick={handleBack}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    ダッシュボードに戻る
                </button>

                {/* ローディング状態 */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">データを読み込み中...</span>
                    </div>
                )}

                {/* エラー状態 */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <div className="text-red-600 mb-2">
                            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 mb-1">
                            データの読み込みに失敗しました
                        </h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            再読み込み
                        </button>
                    </div>
                )}

                {/* メインコンテンツ */}
                {!loading && !error && assetData && (
                    <>
                        {/* 資産ヘッダー */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-lg">
                                            {assetData.symbol?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{assetData.name}</h1>
                                        <p className="text-gray-500 uppercase tracking-wide">{assetData.symbol}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {formatCurrency(assetData.currentPrice)}
                                    </p>
                                    {assetData.change24h !== undefined && (
                                        <p className={`text-lg font-medium ${getChangeColor(assetData.change24h)}`}>
                                            {assetData.change24h > 0 ? '+' : ''}
                                            {assetData.change24h.toFixed(2)}%
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 統計情報 */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">保有数量</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {assetData.amount.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">評価額</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {formatCurrency(assetData.value)}
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">時価総額</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {assetData.marketCap ? formatCurrency(assetData.marketCap) : 'N/A'}
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">ランキング</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        #{assetData.rank || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 価格履歴チャート */}
                        <ChartContainer title="価格推移" height={400}>
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p>価格履歴チャートは準備中です</p>
                                    <p className="text-sm mt-1">今後のアップデートで実装予定</p>
                                </div>
                            </div>
                        </ChartContainer>

                        {/* 詳細情報 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* 市場情報 */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">市場情報</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">24時間取引量</span>
                                        <span className="font-medium text-gray-900">
                                            {assetData.volume24h ? formatCurrency(assetData.volume24h) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">時価総額</span>
                                        <span className="font-medium text-gray-900">
                                            {assetData.marketCap ? formatCurrency(assetData.marketCap) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">市場ランキング</span>
                                        <span className="font-medium text-gray-900">
                                            #{assetData.rank || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 保有情報 */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">保有情報</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">保有数量</span>
                                        <span className="font-medium text-gray-900">
                                            {assetData.amount.toLocaleString()} {assetData.symbol}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">現在価格</span>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(assetData.currentPrice)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">評価額</span>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(assetData.value)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">24時間変動</span>
                                        <span className={`font-medium ${getChangeColor(assetData.change24h)}`}>
                                            {assetData.change24h > 0 ? '+' : ''}
                                            {assetData.change24h.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}