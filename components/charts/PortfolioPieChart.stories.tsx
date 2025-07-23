import type { Meta, StoryObj } from '@storybook/react';
import { PortfolioPieChart } from './PortfolioPieChart';

const meta: Meta<typeof PortfolioPieChart> = {
  title: 'Charts/PortfolioPieChart',
  component: PortfolioPieChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ポートフォリオの資産構成を円グラフで表示するコンポーネント',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PortfolioPieChart>;

const mockAssets = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    value: 1000000,
    ratio: 0.6,
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    value: 500000,
    ratio: 0.3,
  },
  {
    id: 'ada',
    name: 'Cardano',
    symbol: 'ADA',
    value: 166667,
    ratio: 0.1,
  },
];

const mockAssetsTwo = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    value: 800000,
    ratio: 0.8,
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    value: 200000,
    ratio: 0.2,
  },
];

const mockAssetsMany = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    value: 1000000,
    ratio: 0.4,
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
    value: 375000,
    ratio: 0.15,
  },
  {
    id: 'dot',
    name: 'Polkadot',
    symbol: 'DOT',
    value: 250000,
    ratio: 0.1,
  },
  {
    id: 'link',
    name: 'Chainlink',
    symbol: 'LINK',
    value: 125000,
    ratio: 0.05,
  },
];

const mockAssetsSingle = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    value: 1000000,
    ratio: 1.0,
  },
];

export const Default: Story = {
  args: {
    assets: mockAssets,
  },
};

export const TwoAssets: Story = {
  args: {
    assets: mockAssetsTwo,
  },
  parameters: {
    docs: {
      description: {
        story: '2つの資産のみを保有している場合の表示例',
      },
    },
  },
};

export const ManyAssets: Story = {
  args: {
    assets: mockAssetsMany,
  },
  parameters: {
    docs: {
      description: {
        story: '多数の資産を保有している場合の表示例',
      },
    },
  },
};

export const SingleAsset: Story = {
  args: {
    assets: mockAssetsSingle,
  },
  parameters: {
    docs: {
      description: {
        story: '単一の資産のみを保有している場合の表示例',
      },
    },
  },
};

export const EmptyData: Story = {
  args: {
    assets: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'データが空の場合の表示例',
      },
    },
  },
};

// 小さなコンテナでの表示テスト
export const SmallContainer: Story = {
  args: {
    assets: mockAssets,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px', height: '200px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '小さなコンテナ内での表示例',
      },
    },
  },
};