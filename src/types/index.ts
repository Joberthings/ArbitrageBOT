// Core Types and Interfaces

export interface Config {
  arbitrageThreshold: number;
  orderBookVerification: boolean;
  onlyNotifyConfirmed: boolean;
  volumeSpikeThreshold: number;
  minAbsoluteVolume: number;
  hotListSize: number;
  hotListTTL: number;
  scanInterval: number;
  telegram: {
    botToken: string;
    chatId: string;
  };
}

export interface Coin {
  symbol: string;
  name: string;
  marketCap: number;
  rank: number;
}

export interface Price {
  exchange: string;
  symbol: string;
  price: number;
  volume24h: number;
  timestamp: number;
  type: 'CEX' | 'DEX';
  chain?: string; // For DEX
}

export interface VolumeData {
  symbol: string;
  currentVolume: number;
  averageVolume: number;
  volumeSpike: number;
  timestamp: number;
}

export interface HotCoin {
  symbol: string;
  addedAt: number;
  reason: 'volume_spike' | 'high_volume' | 'cross_exchange_disparity' | 'historical_pattern';
  volumeData: VolumeData;
}

export interface ArbitrageOpportunity {
  symbol: string;
  type: 'simple' | 'triangular';
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  priceDifference: number;
  percentageDifference: number;
  estimatedProfit: number;
  fees: FeeBreakdown;
  netProfit: number;
  netProfitPercentage: number;
  timestamp: number;
  tradeAmount: number;
  path?: string[]; // For triangular arbitrage
  orderBookConfirmed?: boolean; // Order book verification
  buyExchangeBid?: number; // Best bid on buy exchange
  buyExchangeAsk?: number; // Best ask on buy exchange
  sellExchangeBid?: number; // Best bid on sell exchange
  sellExchangeAsk?: number; // Best ask on sell exchange
}

export interface OrderBook {
  bids: [number, number][]; // [price, amount]
  asks: [number, number][]; // [price, amount]
  timestamp: number;
}

export interface FeeBreakdown {
  buyTradingFee: number;
  sellTradingFee: number;
  withdrawalFee: number;
  gasFee: number;
  totalFees: number;
}

export interface TriangularPath {
  exchanges: string[];
  symbols: string[];
  prices: number[];
  estimatedProfit: number;
  fees: FeeBreakdown;
  netProfit: number;
}

export interface ExchangeInfo {
  id: string;
  name: string;
  type: 'CEX' | 'DEX';
  tradingFee: number;
  withdrawalFees: Map<string, number>;
  hasWebSocket: boolean;
  rateLimit: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface HistoricalArbitrage {
  symbol: string;
  occurrences: number;
  lastSeen: number;
  averageProfit: number;
}

export interface NotificationMessage {
  title: string;
  message: string;
  opportunity?: ArbitrageOpportunity;
  urgency: 'low' | 'medium' | 'high';
}

// Exchange-specific types
export interface CEXTicker {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  timestamp: number;
}

export interface DEXPrice {
  symbol: string;
  price: number;
  liquidity: number;
  dex: string;
  chain: string;
  timestamp: number;
}

export interface GasFees {
  chain: string;
  standard: number;
  fast: number;
  instant: number;
  timestamp: number;
}
