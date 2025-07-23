import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'アプリケーションのヘッダーコンポーネント。ナビゲーションとタイトルを含みます。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {},
};

export const CustomTitle: Story = {
  args: {
    title: 'My Portfolio Dashboard',
  },
  parameters: {
    docs: {
      description: {
        story: 'カスタムタイトルを設定した場合の表示例',
      },
    },
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Finance Dashboard - Cryptocurrency Portfolio Management System',
  },
  parameters: {
    docs: {
      description: {
        story: '長いタイトルの場合の表示例',
      },
    },
  },
};

// モバイル表示のテスト
export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'モバイルデバイスでの表示例',
      },
    },
  },
};

// タブレット表示のテスト
export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'タブレットデバイスでの表示例',
      },
    },
  },
};