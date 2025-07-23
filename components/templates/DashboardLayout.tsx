/**
 * ダッシュボードレイアウトテンプレート
 * ヘッダー、メインコンテンツ、フッターを含む基本レイアウト
 */
import React from 'react';
import { Header } from '../organisms/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  className = '',
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header title={title} />

      {/* メインコンテンツ */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
        {children}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              © 2025 Finance Dashboard. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                プライバシーポリシー
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                利用規約
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                サポート
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;