import type { Meta, StoryObj } from '@storybook/react';
import { PortfolioSummary } from './PortfolioSummary';
import type { PortfolioSummary as PortfolioSummaryType } from '../../types/portfolio';

const meta: Meta<typeof PortfolioSummary> = {
  title: 'Organisms/PortfolioSummary',
  component: PortfolioSummary,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'ポートフォリオの総評価額と資産構成を表示するコンポーネント',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PortfolioSummary>;

const mockData: PortfolioSummaryType = {
  totalValue: 1234567,
  assets: [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      value: 1000000,
      ratio: 0.81,
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      value: 234567,
      ratio: 0.19,
    },
  ],
};

const mockDataWithMultipleAssets: PortfolioSummaryType = {
  totalValue: 2500000,
  assets: [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      value: 1500000,
      ratio: 0.6,
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      value: 750000,
      ratio: 0.3,
    },
    {
      id: 'ada',
      name: 'Cardano',
      symbol: 'ADA',
      value: 150000,
      ratio: 0.06,
    },
    {
      id: 'dot',
      name: 'Polkadot',
      symbol: 'DOT',
      value: 100000,
      ratio: 0.04,
    },
  ],
};

export const Default: Story = {
  args: {
    data: mockData,
  },
};

export const MultipleAssets: Story = {
  args: {
    data: mockDataWithMultipleAssets,
  },
  parameters: {
    docs: {
      description: {
        story: '複数の資産を保有している場合の表示例',
      },
    },
  },
};

export const SmallPortfolio: Story = {
  args: {
    data: {
      totalValue: 50000,
      assets: [
        {
          id: 'btc',
          name: 'Bitcoin',
          symbol: 'BTC',
          value: 50000,
          ratio: 1.0,
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: '小額ポートフォリオの表示例',
      },
    },
  },
};

export const LargePortfolio: Story = {
  args: {
    data: {
      totalValue: 50000000,
      assets: [
        {
          id: 'btc',
          name: 'Bitcoin',
          symbol: 'BTC',
          value: 30000000,
          ratio: 0.6,
        },
        {
          id: 'eth',
          name: 'Ethereum',
          symbol: 'ETH',
          value: 15000000,
          ratio: 0.3,
        },
        {
          id: 'others',
          name: 'その他',
          symbol: 'OTHERS',
          value: 5000000,
          ratio: 0.1,
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: '大額ポートフォリオの表示例',
      },
    },
  },
};