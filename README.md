# Shopify Insights Platform

A comprehensive multi-tenant analytics platform for Shopify stores, providing real-time insights, custom event tracking, and business intelligence.

## 🚀 Features

### Core Analytics
- **Multi-tenant Architecture**: Support for multiple Shopify stores with data isolation
- **Real-time Data Sync**: Webhook-based synchronization with Shopify APIs
- **Comprehensive KPIs**: Revenue, customers, orders, AOV, repeat customers, growth metrics
- **Custom Event Tracking**: Cart abandonment, checkout started, product views, and more
- **Advanced Visualizations**: Interactive charts and graphs using Recharts
- **Data Export**: CSV export functionality for orders and analytics

### Shopify Integration
- **OAuth Authentication**: Secure connection to Shopify stores
- **Webhook Handlers**: Real-time data synchronization
- **GraphQL API**: Direct integration with Shopify Admin API
- **Multi-store Support**: Manage multiple stores from a single dashboard

### Dashboard Features
- **Professional UI**: Modern, responsive design with Material-UI
- **Date Range Filtering**: Analyze data for specific time periods
- **Real-time Updates**: Live data refresh and webhook processing
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with Prisma ORM
- **Shopify API** integration
- **Redis** (optional) for caching
- **Webhook processing** for real-time sync

### Frontend
- **React 19** with hooks
- **Material-UI** for components
- **Recharts** for data visualization
- **Axios** for API communication

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Shopify Partner Account (for real store integration)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd shopify-insights-platform
```

### 2. Backend Setup
```bash
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and Shopify credentials

# Set up database
npx prisma generate
npx prisma db push
npm run db:seed

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start frontend development server
npm start
```

### 4. Access the Application
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/shopify_insights"

# Shopify App Configuration
SHOPIFY_CLIENT_ID=your_shopify_client_id
SHOPIFY_CLIENT_SECRET=your_shopify_client_secret
SHOPIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Shopify App Setup

1. Create a Shopify Partner account
2. Create a new app in your Partner Dashboard
3. Set the redirect URI to: `http://localhost:3000/api/auth/callback`
4. Copy the Client ID and Client Secret to your `.env` file

## 📊 Demo Data

The platform comes with comprehensive demo data including:
- **12 Customers** with realistic profiles and spending patterns
- **12 Products** across different categories (Electronics, Apparel, Home, etc.)
- **10 Orders** with varied product combinations and pricing
- **5 Custom Events** including cart abandonment and checkout tracking

Use API key `demo-key-123` to access the demo store.

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/url` - Get Shopify OAuth URL
- `GET /api/auth/callback` - Handle OAuth callback

### Data Sync
- `POST /api/ingest` - Trigger data synchronization
- `POST /api/webhooks/:tenantId` - Handle Shopify webhooks

### Analytics
- `GET /api/insights` - Get comprehensive analytics
- `GET /api/customers` - Get customer data
- `GET /api/products` - Get product data
- `GET /api/orders` - Get order data

### Custom Events
- `GET /api/events` - Get custom events
- `POST /api/events` - Create custom events

## 🎯 Usage

### 1. Connect a Store
- Click "Connect Your Store" on the dashboard
- Enter your Shopify store domain (e.g., `your-store.myshopify.com`)
- Complete OAuth authentication
- Your store data will be automatically synced

### 2. Use Demo Data
- Click "Use Demo Store" for instant access to sample data
- Explore all features with realistic e-commerce data

### 3. View Analytics
- **KPIs**: Total customers, orders, revenue, AOV, repeat customers
- **Charts**: Revenue trends, top customers, product performance
- **Custom Events**: Cart abandonment, checkout tracking, product views
- **Date Filtering**: Analyze specific time periods

### 4. Export Data
- Click the download icon to export order data as CSV
- Filter data by date range before exporting

## 🏗️ Architecture

### Multi-Tenancy
- Each tenant (store) has isolated data
- API key-based authentication
- Tenant-specific webhook processing

### Data Flow
1. **OAuth**: User connects Shopify store
2. **Initial Sync**: Full data import from Shopify
3. **Webhooks**: Real-time updates for new orders, customers, products
4. **Analytics**: Processed data for insights and visualizations

### Database Schema
- **Tenants**: Store configurations and API keys
- **Customers**: Shopify customer data with analytics
- **Products**: Product catalog with performance metrics
- **Orders**: Order data with product relationships
- **CustomEvents**: Tracked events and user behavior

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations: `npx prisma db push`
4. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API URLs in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Roadmap

- [ ] Advanced segmentation and customer cohorts
- [ ] Predictive analytics and forecasting
- [ ] Email marketing integration
- [ ] Mobile app
- [ ] Advanced reporting and white-labeling
- [ ] Integration with other e-commerce platforms

---

Built with ❤️ for Shopify merchants and agencies.
