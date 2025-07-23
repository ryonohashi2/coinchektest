export type Asset = {
  id: string;
  name: string;
  amount: number;
  value: number;
  priceHistory?: Price[];
};

export type Price = {
  date: string;
  price: number;
}; 