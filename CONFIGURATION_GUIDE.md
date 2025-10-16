# Configuration Guide - Analytics Backend Integration

## Environment Variables Setup

Create a `.env` file in the project root (same level as `package.json`) with the following variables:

### Development Environment

```env
# Backend API Base URL
REACT_APP_API_URL=http://localhost:5000/api

# Optional: WebSocket URL for real-time updates
REACT_APP_WS_URL=ws://localhost:5000

# Optional: Enable debug mode
REACT_APP_DEBUG=true

# Optional: Analytics refresh interval (in milliseconds)
REACT_APP_ANALYTICS_REFRESH_INTERVAL=30000
```

### Production Environment

```env
# Backend API Base URL
REACT_APP_API_URL=https://your-production-api.com/api

# Optional: WebSocket URL for real-time updates
REACT_APP_WS_URL=wss://your-production-api.com

# Optional: Enable debug mode (set to false in production)
REACT_APP_DEBUG=false

# Optional: Analytics refresh interval (in milliseconds)
REACT_APP_ANALYTICS_REFRESH_INTERVAL=60000
```

## Environment Variable Explanations

### Required Variables

#### `REACT_APP_API_URL`
- **Purpose**: Base URL for backend API calls
- **Development**: `http://localhost:5000/api` (adjust port as needed)
- **Production**: `https://your-production-api.com/api`
- **Used in**: `client/src/services/analyticsService.js`

### Optional Variables

#### `REACT_APP_WS_URL`
- **Purpose**: WebSocket URL for real-time analytics updates
- **Development**: `ws://localhost:5000`
- **Production**: `wss://your-production-api.com`
- **Usage**: If you want real-time analytics updates

#### `REACT_APP_DEBUG`
- **Purpose**: Enable/disable debug logging
- **Values**: `true` or `false`
- **Default**: `false`
- **Usage**: Helpful for development and troubleshooting

#### `REACT_APP_ANALYTICS_REFRESH_INTERVAL`
- **Purpose**: Auto-refresh interval for analytics data (in milliseconds)
- **Default**: `30000` (30 seconds)
- **Usage**: If you want periodic auto-refresh of analytics

## Setup Instructions

### 1. Create .env File

```bash
# In the project root directory
touch .env

# Or on Windows PowerShell
New-Item .env -ItemType File
```

### 2. Add Environment Variables

Open `.env` and add the required variables:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Restart Development Server

After adding environment variables, restart your development server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
# or
yarn dev
```

## Accessing Environment Variables in Code

### In JavaScript/JSX

```javascript
// Access environment variables
const apiUrl = process.env.REACT_APP_API_URL;
const debug = process.env.REACT_APP_DEBUG === 'true';

console.log('API URL:', apiUrl);
```

### In analyticsService.js

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

## Different Environments

### Local Development

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_DEBUG=true
```

### Staging/Testing

```env
REACT_APP_API_URL=https://staging-api.your-domain.com/api
REACT_APP_DEBUG=true
```

### Production

```env
REACT_APP_API_URL=https://api.your-domain.com/api
REACT_APP_DEBUG=false
```

## Vercel Deployment

If deploying to Vercel, add environment variables in the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `REACT_APP_API_URL` | `https://your-api.com/api` | Production |
| `REACT_APP_DEBUG` | `false` | Production |

## Security Best Practices

### ✅ DO:
- Keep `.env` in `.gitignore` (already configured)
- Use different API URLs for dev/staging/prod
- Never commit sensitive data to `.env`
- Use environment-specific values

### ❌ DON'T:
- Commit `.env` to version control
- Store API keys or secrets in frontend env vars
- Use production API URLs in development
- Expose sensitive backend URLs publicly

## Troubleshooting

### Environment Variables Not Working?

1. **Restart the dev server** - Changes to `.env` require restart
2. **Check variable names** - Must start with `REACT_APP_`
3. **Check .env location** - Must be in project root
4. **Check syntax** - No spaces around `=`
   ```env
   # ✅ Correct
   REACT_APP_API_URL=http://localhost:5000/api
   
   # ❌ Wrong
   REACT_APP_API_URL = http://localhost:5000/api
   ```

### CORS Errors?

If you see CORS errors when connecting to the backend:

1. **Backend must allow your frontend origin**
   ```javascript
   // Express.js example
   app.use(cors({
     origin: 'http://localhost:5173', // Your frontend URL
     credentials: true
   }));
   ```

2. **Check API URL is correct**
   ```javascript
   console.log('API URL:', process.env.REACT_APP_API_URL);
   ```

3. **Ensure backend is running**
   ```bash
   # Check if backend is accessible
   curl http://localhost:5000/api/analytics?period=today
   ```

## Example .gitignore

Ensure your `.gitignore` includes:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Dependencies
node_modules/

# Build
dist/
build/

# Logs
*.log
```

## Quick Start Checklist

- [ ] Create `.env` file in project root
- [ ] Add `REACT_APP_API_URL` variable
- [ ] Restart development server
- [ ] Test API connection
- [ ] Update for production deployment

## Support

If you encounter issues:
1. Check this configuration guide
2. Review `ANALYTICS_INTEGRATION_GUIDE.md`
3. Verify backend is running and accessible
4. Check browser console for errors
5. Check network tab for failed requests

---

**Next Steps:**
1. Create `.env` file
2. Add your backend API URL
3. Implement backend endpoints (see `ANALYTICS_INTEGRATION_GUIDE.md`)
4. Test the integration
5. Deploy to production


