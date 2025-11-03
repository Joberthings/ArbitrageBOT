# Deployment Guide

## Free Hosting Options

### Option 1: Railway.app (Recommended)

1. **Create account** at [railway.app](https://railway.app)

2. **New Project** → Deploy from GitHub repo

3. **Add environment variables**:
   ```
   TELEGRAM_BOT_TOKEN=your_token
   TELEGRAM_CHAT_ID=your_chat_id
   ARBITRAGE_THRESHOLD=3
   VOLUME_SPIKE_THRESHOLD=3
   MIN_ABSOLUTE_VOLUME=500000
   HOT_LIST_SIZE=50
   SCAN_INTERVAL=300000
   ```

4. **Deploy** - Railway auto-detects Node.js and runs `npm install && npm run build && npm start`

5. **Done!** Bot runs 24/7 on free tier (500 hours/month)

### Option 2: Fly.io

1. **Install CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**:
   ```bash
   fly auth login
   ```

3. **Create `fly.toml`** (already in repo if added)

4. **Deploy**:
   ```bash
   fly launch
   fly secrets set TELEGRAM_BOT_TOKEN=xxx
   fly secrets set TELEGRAM_CHAT_ID=xxx
   fly deploy
   ```

### Option 3: Render.com

1. Create account at [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. Add environment variables
7. Deploy (free tier sleeps after 15min inactivity - not ideal)

### Option 4: Oracle Cloud (Best for 24/7 free)

1. Create account at [oracle.com/cloud](https://oracle.com/cloud)
2. Create Ubuntu VM (ARM - Always Free)
3. SSH into VM:
   ```bash
   ssh ubuntu@<your-ip>
   ```
4. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs git
   ```
5. Clone and run:
   ```bash
   git clone https://github.com/kusunz/ArbitrageBOT.git
   cd ArbitrageBOT
   npm install
   npm run build

   # Create .env file
   nano .env
   # (paste your config)

   # Run with PM2 for persistence
   sudo npm install -g pm2
   pm2 start npm --name arbitrage-bot -- start
   pm2 save
   pm2 startup
   ```

## Important Notes

### Rate Limits
- CoinGecko free tier: 50 calls/minute
- Bot now includes retry logic and 1-minute waits
- Uses fallback coin list if API fails
- Caches data for 1 hour to minimize calls

### Monitoring
- Check logs: `pm2 logs` (if using PM2)
- Railway/Fly.io have built-in logs
- Bot sends errors to console

### Stopping the Bot
- Railway: Pause project in dashboard
- Fly.io: `fly apps stop`
- PM2: `pm2 stop arbitrage-bot`
- Ctrl+C if running directly

## Troubleshooting

**Rate limit errors**:
- Bot now handles these automatically
- Waits 60 seconds and retries
- Uses fallback top 100 coins if needed

**Bot not starting**:
- Check environment variables are set
- Verify Telegram credentials
- Check logs for errors

**No opportunities found**:
- Normal during low volatility
- Lower ARBITRAGE_THRESHOLD to see more
- Check logs to confirm bot is running

## Cost Estimate

- **Railway**: Free tier sufficient (500 hours/month)
- **Fly.io**: Free (3 VMs included)
- **Oracle Cloud**: FREE FOREVER
- **Render**: Free (with sleep)

For 24/7 operation, use Railway, Fly.io, or Oracle Cloud.
