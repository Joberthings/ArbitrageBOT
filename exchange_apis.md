# Exchange API Availability

## Already Implemented (8/20):
✅ Binance - `/sapi/v1/capital/config/getall`
✅ Bybit - `/v5/asset/coin/query-info`
✅ OKX - `/api/v5/asset/currencies`
✅ Gate.io - `/api/v4/wallet/currency_chains`
✅ KuCoin - `/api/v1/currencies`
✅ HTX (Huobi) - `/v2/reference/currencies`
✅ MEXC - `/api/v3/capital/config/getall`
✅ Bitget - `/api/spot/v1/public/currencies`

## Can Be Added (5/20):

### 1. Kraken
- API: `https://api.kraken.com/0/public/Assets`
- Status: Public endpoint available
- Returns: Asset info with deposit/withdrawal status

### 2. Crypto.com
- API: `https://api.crypto.com/v2/public/get-currency-map`
- Status: Limited public info
- May need private API for full status

### 3. Bitfinex
- API: `https://api.bitfinex.com/v1/symbols`
- Status: Public but limited deposit/withdrawal info
- Mainly trading pairs only

### 4. Poloniex
- API: `https://api.poloniex.com/currencies`
- Status: Public endpoint available
- Returns: Currency status info

### 5. BingX
- API: `https://open-api.bingx.com/openApi/spot/v1/capital/config/getall`
- Status: Public endpoint available (similar to Binance)

## Limited/No Public API (7/20):

### Coinbase
- Status: Requires authentication for deposit/withdrawal status
- Public API doesn't expose this info

### Gemini
- Status: Private API only for account info
- No public status endpoint

### Bitstamp
- Status: No public endpoint for coin status
- Account-specific only

### Phemex
- Status: Limited public API
- No currency status endpoint found

### BitMart
- Status: API exists but needs authentication
- No public status endpoint

### LBank
- Status: Limited documentation
- Unclear if status endpoint exists

### AscendEX
- Status: API exists but limited public access
- No clear status endpoint

## Recommendation:

Add these 5 exchanges with public APIs:
1. Kraken ⭐ (Major exchange)
2. Poloniex ⭐ (Good API)
3. BingX ⭐ (Similar to Binance API)
4. Bitfinex (Limited info)
5. Crypto.com (Limited info)

This would bring us to **13/20 exchanges** monitored.
