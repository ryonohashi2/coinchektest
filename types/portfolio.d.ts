import { Asset } from './asset';

export type Portfolio = {
  totalValue: number;
  assets: (Asset & { ratio: number })[];
}; 