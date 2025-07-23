import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof Button> = {
  args: {
    children: 'Click me',
  },
};

export const Disabled: StoryObj<typeof Button> = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}; 