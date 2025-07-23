/**
 * API関連の型定義
 */

// 共通APIレスポンス
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  requestId?: string;
}

// APIエラー情報
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// ページネーション情報
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ページネーション付きレスポンス
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

// =============================================================================
// Coincheck API型定義
// =============================================================================

// Coincheck残高レスポンス
export interface CoincheckBalance {
  success: boolean;
  jpy: string;                   // 日本円残高
  btc: string;                   // Bitcoin残高
  eth: string;                   // Ethereum残高
  etc: string;                   // Ethereum Classic残高
  lsk: string;                   // Lisk残高
  fct: string;                   // Factom残高
  xrp: string;                   // Ripple残高
  xem: string;                   // NEM残高
  ltc: string;                   // Litecoin残高
  bch: string;                   // Bitcoin Cash残高
  mona: string;                  // MonaCoin残高
  xlm: string;                   // Stellar残高
  qtum: string;                  // Qtum残高
  bat: string;                   // Basic Attention Token残高
  iost: string;                  // IOST残高
  enj: string;                   // Enjin Coin残高
  omg: string;                   // OMG Network残高
  plt: string;                   // Palette Token残高
}

// Coincheckレート情報
export interface CoincheckRate {
  rate: string;                  // レート
  price?: string;                // 価格（オプション）
  amount?: string;               // 数量（オプション）
}

// Coincheck取引履歴
export interface CoincheckTransaction {
  id: number;                    // 取引ID
  order_id: number;              // 注文ID
  created_at: string;            // 作成日時
  funds: Record<string, string>; // 資金情報
  pair: string;                  // 通貨ペア
  rate: string;                  // レート
  fee_currency: string;          // 手数料通貨
  fee: string;                   // 手数料
  liquidity: string;             // 流動性
  side: 'buy' | 'sell';          // 売買区分
}

// =============================================================================
// CoinGecko API型定義
// =============================================================================

// CoinGecko市場データ
export interface CoinGeckoMarketData {
  id: string;                              // コインID
  symbol: string;                          // シンボル
  name: string;                            // 名前
  image?: string;                          // アイコンURL
  current_price: number;                   // 現在価格
  market_cap: number;                      // 時価総額
  market_cap_rank: number;                 // 時価総額ランキング
  fully_diluted_valuation: number | null;  // 完全希薄化評価額
  total_volume: number;                    // 24時間取引量
  high_24h: number;                        // 24時間最高値
  low_24h: number;                         // 24時間最安値
  price_change_24h: number;                // 24時間価格変動
  price_change_percentage_24h: number;     // 24時間価格変動率
  market_cap_change_24h: number;           // 24時間時価総額変動
  market_cap_change_percentage_24h: number;// 24時間時価総額変動率
  circulating_supply: number;              // 流通供給量
  total_supply: number | null;             // 総供給量
  max_supply: number | null;               // 最大供給量
  ath: number;                             // 過去最高値
  ath_change_percentage: number;           // 過去最高値からの変動率
  ath_date: string;                        // 過去最高値日時
  atl: number;                             // 過去最安値
  atl_change_percentage: number;           // 過去最安値からの変動率
  atl_date: string;                        // 過去最安値日時
  roi?: {                                  // ROI情報
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;                    // 最終更新日時
}

// CoinGecko価格履歴
export interface CoinGeckoPriceHistory {
  prices: [number, number][];              // [timestamp, price]
  market_caps: [number, number][];         // [timestamp, market_cap]
  total_volumes: [number, number][];       // [timestamp, volume]
}

// CoinGeckoコイン詳細
export interface CoinGeckoCoinDetail {
  id: string;                              // コインID
  symbol: string;                          // シンボル
  name: string;                            // 名前
  asset_platform_id: string | null;       // プラットフォームID
  platforms: Record<string, string>;      // プラットフォーム情報
  detail_platforms: Record<string, any>;  // 詳細プラットフォーム情報
  block_time_in_minutes: number;          // ブロック時間（分）
  hashing_algorithm: string;               // ハッシュアルゴリズム
  categories: string[];                    // カテゴリ
  public_notice: string | null;           // 公開通知
  additional_notices: string[];           // 追加通知
  description: Record<string, string>;    // 説明（多言語）
  links: {                                 // リンク情報
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: number | null;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  image: {                                 // 画像URL
    thumb: string;
    small: string;
    large: string;
  };
  country_origin: string;                  // 原産国
  genesis_date: string | null;            // 開始日
  sentiment_votes_up_percentage: number;  // ポジティブ投票率
  sentiment_votes_down_percentage: number;// ネガティブ投票率
  watchlist_portfolio_users: number;     // ウォッチリストユーザー数
  market_cap_rank: number;                // 時価総額ランキング
  coingecko_rank: number;                 // CoinGeckoランキング
  coingecko_score: number;                // CoinGeckoスコア
  developer_score: number;                // 開発者スコア
  community_score: number;                // コミュニティスコア
  liquidity_score: number;                // 流動性スコア
  public_interest_score: number;          // 公共関心スコア
  market_data: CoinGeckoMarketData;       // 市場データ
  community_data: {                       // コミュニティデータ
    facebook_likes: number | null;
    twitter_followers: number | null;
    reddit_average_posts_48h: number;
    reddit_average_comments_48h: number;
    reddit_subscribers: number | null;
    reddit_accounts_active_48h: number | null;
    telegram_channel_user_count: number | null;
  };
  developer_data: {                       // 開発者データ
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: {
      additions: number;
      deletions: number;
    };
    commit_count_4_weeks: number;
    last_4_weeks_commit_activity_series: number[];
  };
  public_interest_stats: {                // 公共関心統計
    alexa_rank: number | null;
    bing_matches: number | null;
  };
  status_updates: any[];                  // ステータス更新
  last_updated: string;                   // 最終更新日時
}

// CoinGecko Ping レスポンス
export interface CoinGeckoPing {
  gecko_says: string;                     // "(V3) To the Moon!"
}

// =============================================================================
// 内部API型定義（Next.js API Routes用）
// =============================================================================

// ポートフォリオサマリーAPIレスポンス
export interface PortfolioSummaryApiResponse {
  totalValue: number;
  assets: {
    id: string;
    name: string;
    symbol: string;
    value: number;
    ratio: number;
  }[];
}

// 資産一覧APIレスポンス
export interface AssetsApiResponse {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  currentPrice: number;
  change24h: number;
}[]

// 資産詳細APIレスポンス
export interface AssetDetailApiResponse {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  currentPrice: number;
  change24h: number;
  priceHistory: {
    date: string;
    price: number;
  }[];
  marketCap: number;
  volume24h: number;
  rank: number;
}

// 接続テストAPIレスポンス
export interface ConnectionTestApiResponse {
  overall: 'success' | 'partial' | 'error';
  results: {
    service: string;
    status: 'success' | 'error';
    message: string;
    timestamp: string;
  }[];
}