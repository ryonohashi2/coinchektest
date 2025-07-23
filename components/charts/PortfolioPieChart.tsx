import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "../../lib/utils";

type Asset = {
  id: string;
  name: string;
  symbol: string;
  value: number;
  ratio: number;
};

type Props = { 
  assets: Asset[];
  height?: number;
};

const COLORS = [
  "#F59E0B", // Luxury Gold
  "#EAB308", // Rich Yellow
  "#D97706", // Deep Amber
  "#B45309", // Bronze
  "#92400E", // Dark Gold
  "#F3E8FF", // Light Purple
  "#DDD6FE", // Soft Lavender
  "#C4B5FD", // Medium Purple
];

// カスタムツールチップ
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 border-2 border-amber-400/50 rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-2">
          <span className="text-2xl">💎</span>
        </div>
        <p className="font-bold text-amber-200 text-lg">{data.name}</p>
        <p className="text-sm text-amber-300/70 uppercase tracking-wider mb-2">{data.symbol}</p>
        <p className="text-amber-100 font-bold text-xl">
          {formatCurrency(data.value)}
        </p>
        <p className="text-amber-300 text-sm font-medium">
          {(data.ratio * 100).toFixed(1)}% of portfolio
        </p>
      </div>
    );
  }
  return null;
};

// カスタムラベル
const renderLabel = (props: any) => {
  const percentage = (props.ratio * 100).toFixed(1);
  return `${percentage}%`;
};

export const PortfolioPieChart: React.FC<Props> = ({ 
  assets, 
  height = 300 
}) => {
  if (!assets || assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-amber-200">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">💎</div>
          <p className="text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
            まだ資産がありません
          </p>
          <p className="text-amber-300/70 mt-2">
            投資を開始して富を築きましょう
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={assets}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={Math.min(height * 0.3, 120)}
          innerRadius={Math.min(height * 0.15, 60)}
          label={renderLabel}
          labelLine={false}
        >
          {assets.map((entry, index) => (
            <Cell 
              key={entry.id} 
              fill={COLORS[index % COLORS.length]}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => (
            <span className="text-sm text-amber-200 font-medium">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}; 