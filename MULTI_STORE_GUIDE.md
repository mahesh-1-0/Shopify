# 🏪 Multi-Store Demo Guide

## How to Use Different API Keys to Simulate Separate Stores

The Shopify Insights Platform now supports **5 different demo stores** with completely isolated data. Each store represents a different business type with unique customers, products, and analytics.

## 🎯 Available Demo Stores

| Store Name | API Key | Business Type | Description |
|------------|---------|---------------|-------------|
| **Fashion Forward Store** | `fashion-store-456` | Fashion & Apparel | Designer dresses, leather jackets, sneakers |
| **Tech Gadgets Hub** | `tech-store-789` | Electronics | Smartphones, laptops, wireless earbuds |
| **Home & Garden Co** | `home-store-101` | Home & Garden | Coffee makers, throw pillows, plant pots |
| **Sports & Fitness** | `sports-store-202` | Sports & Fitness | Running shoes, dumbbells, yoga mats |
| **Beauty & Wellness** | `beauty-store-303` | Beauty & Wellness | Face cream, lipstick sets, essential oils |

## 🚀 How to Switch Between Stores

### Method 1: Using the Login Modal
1. **Open the application** at http://localhost:3001
2. **Click "Use Demo Store"** in the login modal
3. **Enter any email** (e.g., `demo@example.com`)
4. **Enter the API Key** for the store you want to view:
   - `fashion-store-456` for Fashion Forward Store
   - `tech-store-789` for Tech Gadgets Hub
   - `home-store-101` for Home & Garden Co
   - `sports-store-202` for Sports & Fitness
   - `beauty-store-303` for Beauty & Wellness
5. **Click "Use Demo Store"** to access that store's data

### Method 2: Direct API Testing
You can also test the API directly using different API keys:

```bash
# Fashion Store
curl "http://localhost:3000/api/customers?apiKey=fashion-store-456"

# Tech Store
curl "http://localhost:3000/api/customers?apiKey=tech-store-789"

# Home Store
curl "http://localhost:3000/api/customers?apiKey=home-store-101"

# Sports Store
curl "http://localhost:3000/api/customers?apiKey=sports-store-202"

# Beauty Store
curl "http://localhost:3000/api/customers?apiKey=beauty-store-303"
```

## 📊 What You'll See in Each Store

### Fashion Forward Store (`fashion-store-456`)
- **3 Customers**: Sarah Fashion, Mike Style, Lisa Trendy
- **3 Products**: Designer Dress ($89.99), Leather Jacket ($149.99), Sneakers ($79.99)
- **3 Orders**: Fashion-focused purchases
- **Custom Events**: Cart abandonment, checkout tracking

### Tech Gadgets Hub (`tech-store-789`)
- **3 Customers**: Alex Tech, Emma Gadget, David Geek
- **3 Products**: Smartphone ($699.99), Laptop ($1299.99), Wireless Earbuds ($199.99)
- **3 Orders**: High-value tech purchases
- **Custom Events**: Product views, checkout tracking

### Home & Garden Co (`home-store-101`)
- **3 Customers**: Maria Home, John Garden, Anna Decor
- **3 Products**: Coffee Maker ($89.99), Throw Pillow ($24.99), Plant Pot ($19.99)
- **3 Orders**: Home improvement purchases
- **Custom Events**: Cart abandonment, product views

### Sports & Fitness (`sports-store-202`)
- **3 Customers**: Tom Athlete, Lisa Fitness, Chris Runner
- **3 Products**: Running Shoes ($129.99), Dumbbells Set ($79.99), Yoga Mat ($39.99)
- **3 Orders**: Fitness equipment purchases
- **Custom Events**: Checkout tracking, product views

### Beauty & Wellness (`beauty-store-303`)
- **3 Customers**: Sophia Beauty, Emma Glow, Maya Wellness
- **3 Products**: Face Cream ($49.99), Lipstick Set ($29.99), Essential Oils ($34.99)
- **3 Orders**: Beauty and wellness purchases
- **Custom Events**: Cart abandonment, checkout tracking

## 🔄 Switching Between Stores

1. **Logout** from the current store (click the "Logout" button)
2. **Click "Use Demo Store"** again
3. **Enter a different API key** for the store you want to view
4. **Click "Use Demo Store"** to switch to that store

## 📈 Analytics Differences

Each store will show different analytics because they have:
- **Different customer bases** with varying spending patterns
- **Different product catalogs** with unique pricing
- **Different order volumes** and revenue patterns
- **Different custom events** and user behavior

## 🛠️ Technical Details

### Multi-Tenancy Implementation
- Each store has a **unique API key** that acts as a tenant identifier
- All data is **completely isolated** by tenant ID
- **No data leakage** between stores
- **Independent analytics** for each store

### Database Structure
```
Tenant (Store)
├── Customers (3 per store)
├── Products (3 per store)
├── Orders (2-3 per store)
└── Custom Events (2 per store)
```

### API Endpoints
All API endpoints support the `apiKey` parameter:
- `GET /api/customers?apiKey=STORE_KEY`
- `GET /api/products?apiKey=STORE_KEY`
- `GET /api/orders?apiKey=STORE_KEY`
- `GET /api/insights?apiKey=STORE_KEY`
- `GET /api/events?apiKey=STORE_KEY`

## 🎯 Use Cases

This multi-store setup is perfect for:
- **Agency Demo**: Show different client stores to prospects
- **Testing**: Verify multi-tenant functionality
- **Training**: Demonstrate different business types
- **Development**: Test store-specific features

## 🚀 Getting Started

1. **Start the backend**: `cd backend && npm run dev`
2. **Start the frontend**: `cd frontend && npm start`
3. **Open browser**: Go to http://localhost:3001
4. **Choose a store**: Use any of the 5 API keys above
5. **Explore analytics**: Each store has unique data and insights

---

**Happy exploring!** 🎉 Each store offers a completely different business experience with realistic data and analytics.
