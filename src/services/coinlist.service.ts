import axios from 'axios';
import { Coin } from '../types';
import { globalCache } from '../utils/cache';
import { Logger } from '../utils/logger';
import { CACHE_TTL, QUOTE_CURRENCIES } from '../config/config';

/**
 * Service to fetch and manage the list of top coins by market cap
 * Uses CoinGecko free API
 */
export class CoinListService {
  private readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';
  private readonly TOP_N_COINS = 1300;
  private coins: Coin[] = [];

  /**
   * Fetch top 1300 coins by market cap from CoinGecko
   */
  async fetchTopCoins(): Promise<Coin[]> {
    const cacheKey = 'coinlist:top_coins';
    const cached = globalCache.get<Coin[]>(cacheKey);

    if (cached) {
      Logger.debug('Using cached coin list');
      this.coins = cached;
      return cached;
    }

    try {
      Logger.info(`Fetching top ${this.TOP_N_COINS} coins from CoinGecko...`);

      const coins: Coin[] = [];
      const perPage = 250; // CoinGecko max per page
      const pages = Math.ceil(this.TOP_N_COINS / perPage);

      for (let page = 1; page <= pages; page++) {
        let retries = 3;
        let success = false;

        while (retries > 0 && !success) {
          try {
            const response = await axios.get(`${this.COINGECKO_API}/coins/markets`, {
              params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: perPage,
                page,
                sparkline: false,
              },
              timeout: 10000,
            });

            const pageCoins: Coin[] = response.data.map((coin: any, index: number) => ({
              symbol: coin.symbol.toUpperCase(),
              name: coin.name,
              marketCap: coin.market_cap,
              rank: (page - 1) * perPage + index + 1,
            }));

            coins.push(...pageCoins);
            success = true;

            // Rate limiting: wait 2 seconds between requests
            if (page < pages) {
              await this.sleep(2000);
            }
          } catch (err: any) {
            retries--;
            if (err.response?.status === 429) {
              const waitTime = 60000; // Wait 1 minute on rate limit
              Logger.warn(`Rate limited. Waiting ${waitTime / 1000}s before retry...`);
              await this.sleep(waitTime);
            } else if (retries > 0) {
              Logger.warn(`Request failed, retrying... (${retries} left)`);
              await this.sleep(3000);
            } else {
              throw err;
            }
          }
        }
      }

      this.coins = coins.slice(0, this.TOP_N_COINS);
      globalCache.set(cacheKey, this.coins, CACHE_TTL.coinList);

      Logger.success(`Fetched ${this.coins.length} coins successfully`);
      return this.coins;
    } catch (error: any) {
      Logger.error('Failed to fetch coin list from CoinGecko:', error.message);

      // Fallback: use a basic hardcoded top 100 if API fails
      if (this.coins.length === 0) {
        Logger.warn('Using fallback coin list (top 100 major coins)');
        this.coins = this.getFallbackCoins();
        globalCache.set(cacheKey, this.coins, CACHE_TTL.coinList);
      }

      return this.coins;
    }
  }

  /**
   * Get trading pairs for a coin (symbol/USDT, symbol/USDC)
   */
  getTradingPairs(symbol: string): string[] {
    return QUOTE_CURRENCIES.map(quote => `${symbol}/${quote}`);
  }

  /**
   * Get all trading pairs for top coins
   */
  getAllTradingPairs(): string[] {
    const pairs: string[] = [];

    for (const coin of this.coins) {
      pairs.push(...this.getTradingPairs(coin.symbol));
    }

    return pairs;
  }

  /**
   * Get coin by symbol
   */
  getCoinBySymbol(symbol: string): Coin | undefined {
    return this.coins.find(c => c.symbol === symbol.toUpperCase());
  }

  /**
   * Get current coin list
   */
  getCoins(): Coin[] {
    return this.coins;
  }

  /**
   * Get coin symbols only
   */
  getCoinSymbols(): string[] {
    return this.coins.map(c => c.symbol);
  }

  /**
   * Filter coins by minimum market cap
   */
  filterByMarketCap(minMarketCap: number): Coin[] {
    return this.coins.filter(c => c.marketCap >= minMarketCap);
  }

  /**
   * Sleep utility for rate limiting
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fallback coin list when API fails (top 100 major coins)
   */
  private getFallbackCoins(): Coin[] {
    const topCoins = [
      'BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'USDC', 'XRP', 'DOGE', 'ADA', 'TRX',
      'AVAX', 'SHIB', 'DOT', 'LINK', 'MATIC', 'UNI', 'LTC', 'BCH', 'XLM', 'ATOM',
      'ETC', 'XMR', 'APT', 'OKB', 'FIL', 'ARB', 'OP', 'NEAR', 'VET', 'ALGO',
      'ICP', 'HBAR', 'GRT', 'SAND', 'MANA', 'AAVE', 'QNT', 'AXS', 'EOS', 'FTM',
      'MKR', 'SNX', 'RUNE', 'THETA', 'XTZ', 'FLOW', 'CHZ', 'ZEC', 'EGLD', 'KLAY',
      'CAKE', 'NEO', 'MINA', 'GALA', 'FTT', 'CRV', 'LDO', 'BLUR', 'IMX', 'RPL',
      'DYDX', 'GMX', 'COMP', 'ENJ', 'BAT', 'ZIL', 'DASH', 'WAVES', 'IOTX', 'KSM',
      'HNT', 'ONE', 'AR', 'CELO', 'LRC', 'STX', 'HOT', 'ANKR', 'YFI', 'KAVA',
      'GMT', 'APE', 'CFX', 'ROSE', 'CHR', 'GAL', 'MASK', 'SUI', 'SEI', 'WLD',
      'INJ', 'TIA', 'FET', 'AGIX', 'RNDR', 'PEPE', 'WOO', 'MAGIC', 'PENDLE', 'JTO'
    ];

    return topCoins.map((symbol, index) => ({
      symbol,
      name: symbol,
      marketCap: 1000000000 * (100 - index), // Fake market cap
      rank: index + 1,
    }));
  }
}

// Singleton instance
export const coinListService = new CoinListService();
