# Analytics Page - Backend Integration Guide

## Overview
This guide explains how to integrate the Analytics page with your backend API. The analytics page displays comprehensive data based on different time periods: Today, 1 Week, 1 Month, and 1 Year.

## Quick Start

### 1. Update API Base URL
Update the base URL in `client/src/services/analyticsService.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### 2. Replace Mock Data with API Call
In `client/src/pages/analytics.jsx`, replace the mock data with actual API call:

```javascript
// Current (Line 155-161):
// For now, using mock data
setAnalyticsData(getMockDataByPeriod(activeTab));

// Replace with:
import { fetchAnalyticsByPeriod } from '../services/analyticsService';

const response = await fetchAnalyticsByPeriod(activeTab);
setAnalyticsData(response);
```

## Backend API Endpoints Required

### 1. Get Analytics Data
**Endpoint:** `GET /api/analytics?period={period}`

**Parameters:**
- `period`: String - "today", "week", "month", or "year"

**Response Structure:**
```json
{
  "totalRevenue": 5420.50,
  "totalTransactions": 87,
  "averageOrderValue": 62.30,
  "peakHours": "12:00 PM - 1:00 PM",
  "revenueTrend": [
    { "label": "8AM", "value": 450 },
    { "label": "9AM", "value": 620 },
    { "label": "10AM", "value": 580 }
  ],
  "topSellingItems": [
    { 
      "name": "Chicken Adobo Rice", 
      "orders": 45, 
      "revenue": 2250 
    },
    { 
      "name": "Beef Burger Meal", 
      "orders": 38, 
      "revenue": 2280 
    }
  ],
  "bestPerformance": "Chicken Adobo Rice",
  "highestRevenue": "Beef Burger Meal",
  "growthRate": 12.5,
  "totalOrders": 87,
  "activeCustomers": 76,
  "newCustomers": 12
}
```

### 2. Revenue Trend Labels by Period

The `revenueTrend` array `label` field should vary based on the period:

- **Today**: Hourly format - `"8AM"`, `"9AM"`, `"10AM"`, etc.
- **1 Week**: Days - `"Mon"`, `"Tue"`, `"Wed"`, `"Thu"`, `"Fri"`, `"Sat"`, `"Sun"`
- **1 Month**: Weeks - `"Week 1"`, `"Week 2"`, `"Week 3"`, `"Week 4"`
- **1 Year**: Months - `"Jan"`, `"Feb"`, `"Mar"`, `"Apr"`, `"May"`, `"Jun"`, `"Jul"`, `"Aug"`, `"Sep"`, `"Oct"`, `"Nov"`, `"Dec"`

### 3. Top Selling Items Count
Return exactly 5 top selling items ordered by orders count (descending).

## Backend Implementation Examples

### Node.js/Express Example

```javascript
// routes/analytics.js
router.get('/analytics', async (req, res) => {
  try {
    const { period } = req.query; // "today", "week", "month", "year"
    
    const analyticsData = await getAnalyticsData(period);
    
    res.json(analyticsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// services/analyticsService.js
async function getAnalyticsData(period) {
  let startDate, endDate;
  
  // Calculate date range based on period
  switch (period) {
    case 'today':
      startDate = new Date().setHours(0, 0, 0, 0);
      endDate = new Date().setHours(23, 59, 59, 999);
      break;
    case 'week':
      // Last 7 days logic
      break;
    case 'month':
      // Last 30 days logic
      break;
    case 'year':
      // Last 12 months logic
      break;
  }
  
  // Query database
  const totalRevenue = await Order.sum('total', {
    where: {
      createdAt: {
        $between: [startDate, endDate]
      }
    }
  });
  
  const totalTransactions = await Order.count({
    where: {
      createdAt: {
        $between: [startDate, endDate]
      }
    }
  });
  
  const topSellingItems = await OrderItem.findAll({
    attributes: [
      'item_name',
      [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
      [sequelize.fn('SUM', sequelize.col('price')), 'revenue']
    ],
    where: {
      createdAt: {
        $between: [startDate, endDate]
      }
    },
    group: ['item_name'],
    order: [[sequelize.literal('orders'), 'DESC']],
    limit: 5
  });
  
  // Return formatted data
  return {
    totalRevenue,
    totalTransactions,
    averageOrderValue: totalRevenue / totalTransactions,
    // ... other fields
  };
}
```

### Python/FastAPI Example

```python
# routes/analytics.py
@router.get("/analytics")
async def get_analytics(period: str = Query(..., regex="^(today|week|month|year)$")):
    try:
        analytics_data = await get_analytics_data(period)
        return analytics_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# services/analytics_service.py
async def get_analytics_data(period: str):
    start_date, end_date = get_date_range(period)
    
    # Query database
    total_revenue = await db.scalar(
        select(func.sum(Order.total)).where(
            Order.created_at.between(start_date, end_date)
        )
    )
    
    total_transactions = await db.scalar(
        select(func.count(Order.id)).where(
            Order.created_at.between(start_date, end_date)
        )
    )
    
    top_selling_items = await db.execute(
        select(
            OrderItem.name,
            func.count(OrderItem.id).label('orders'),
            func.sum(OrderItem.price).label('revenue')
        )
        .where(OrderItem.created_at.between(start_date, end_date))
        .group_by(OrderItem.name)
        .order_by(desc('orders'))
        .limit(5)
    )
    
    return {
        "totalRevenue": total_revenue or 0,
        "totalTransactions": total_transactions or 0,
        "averageOrderValue": (total_revenue / total_transactions) if total_transactions > 0 else 0,
        # ... other fields
    }
```

## Database Schema Requirements

Your database should have the following tables/collections:

### Orders Table
```sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    total DECIMAL(10, 2),
    status VARCHAR(50),
    customer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    item_name VARCHAR(255),
    quantity INT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

## Environment Variables

Add to your `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

For production:
```
REACT_APP_API_URL=https://your-production-api.com/api
```

## Testing the Integration

### 1. Test with Mock Data First
The analytics page is already set up with mock data. Test the UI first to ensure everything displays correctly.

### 2. Test API Endpoints
Use tools like Postman or curl to test your backend endpoints:

```bash
curl http://localhost:5000/api/analytics?period=today
```

### 3. Replace Mock Data
Once your API is ready, update the `fetchAnalyticsData` function in `analytics.jsx`:

```javascript
const response = await fetch(`${API_BASE_URL}/analytics?period=${periodParam}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  },
});

const data = await response.json();
setAnalyticsData(data);
```

## Additional Features (Optional)

### Export Functionality
Add export buttons to download reports:

```javascript
import { exportAnalyticsReport } from '../services/analyticsService';

const handleExport = async (format) => {
  try {
    const blob = await exportAnalyticsReport(activeTab, format);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${activeTab}-${new Date().toISOString()}.${format}`;
    a.click();
  } catch (error) {
    console.error('Export failed:', error);
  }
};
```

### Real-time Updates
Add WebSocket connection for real-time analytics:

```javascript
useEffect(() => {
  const ws = new WebSocket('ws://localhost:5000/analytics');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setAnalyticsData(data);
  };
  
  return () => ws.close();
}, []);
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors, add CORS headers to your backend:

```javascript
// Express
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Authentication
If using authentication, ensure the token is sent with requests:

```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
}
```

## Support

For questions or issues, refer to:
- `client/src/services/analyticsService.js` - API service implementation
- `client/src/pages/analytics.jsx` - Analytics page component
- Your backend documentation

## Summary

1. ✅ Analytics page UI is complete and responsive
2. ✅ Mock data structure is defined for all time periods
3. ✅ API service file is created with all necessary functions
4. ✅ Loading states and error handling are implemented
5. 📝 Replace mock data with actual API calls (TODO)
6. 📝 Implement backend endpoints (TODO)
7. 📝 Test integration (TODO)

The analytics page is now ready for backend integration! Simply implement the backend endpoints and replace the mock data calls with actual API calls using the provided service functions.


