// backend/routes/api.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const ShopifyService = require('../services/shopifyService');
const OAuthService = require('../services/oauthService');
const WebhookService = require('../services/webhookService');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const prisma = new PrismaClient();
const oauthService = new OAuthService();

// ----------------------
// Middleware: Identify tenant via API key
// ----------------------
async function identifyTenant(req, res, next) {
  const apiKey = req.query.apiKey;
  if (!apiKey) {
    return res.status(400).json({ error: 'apiKey is required' });
  }

  const tenant = await prisma.tenant.findUnique({ where: { apiKey } });
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  req.tenant = tenant;
  next();
}

// ----------------------
// Helper: parse date range from query
// ----------------------
function parseDateRange(req) {
  const from = req.query.from ? new Date(req.query.from) : new Date('1970-01-01');
  const to = req.query.to ? new Date(req.query.to) : new Date();
  to.setHours(23, 59, 59, 999); // include full "to" day
  return { from, to };
}

// ----------------------
// Dummy Shopify ingestion function (simulate fetching from Shopify)
// ----------------------
async function ingestShopifyData(tenantId) {
  const dummyCustomers = [
    { shopifyId: "cust_003", name: "Charlie", email: "charlie@example.com" },
    { shopifyId: "cust_004", name: "David", email: "david@example.com" },
  ];

  const dummyProducts = [
    { shopifyId: "prod_003", title: "Lined Notebook", price: 15 },
    { shopifyId: "prod_004", title: "Gel Pen", price: 5 },
  ];

  const createdCustomers = [];
  for (const c of dummyCustomers) {
    const customer = await prisma.customer.upsert({
      where: { shopifyId: c.shopifyId },
      update: {},
      create: { ...c, tenantId },
    });
    createdCustomers.push(customer);
  }

  const createdProducts = [];
  for (const p of dummyProducts) {
    const product = await prisma.product.upsert({
      where: { shopifyId: p.shopifyId },
      update: {},
      create: { ...p, tenantId },
    });
    createdProducts.push(product);
  }

  return { customers: createdCustomers, products: createdProducts };
}

// ----------------------
// ROUTES
// ----------------------

// POST /api/ingest - trigger Shopify data ingestion
router.post('/ingest', identifyTenant, async (req, res) => {
  try {
    // For live stores, we check for an access token.
    // For demo stores (identified by '-store-'), we skip this check.
    if (!req.tenant.apiKey.includes('-store-') && !req.tenant.accessToken) {
      return res.status(400).json({ error: 'Tenant not connected to Shopify. Please complete OAuth first.' });
    }

    const shopifyService = new ShopifyService(req.tenant);
    const result = await shopifyService.fullSync();

    res.json({ message: 'Data ingested successfully', ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ingestion failed: ' + err.message });
  }
});

// GET /api/auth/url - Get OAuth URL for Shopify connection
router.get('/auth/url', identifyTenant, async (req, res) => {
  try {
    const { shopDomain } = req.query;
    if (!shopDomain) {
      return res.status(400).json({ error: 'shopDomain is required' });
    }

    const { url, state } = oauthService.generateAuthUrl(shopDomain);
    
    // Store state for verification
    await prisma.tenant.update({
      where: { id: req.tenant.id },
      data: { webhookSecret: state }, // Temporarily store state
    });

    res.json({ authUrl: url, state });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// GET /api/auth/callback - Handle OAuth callback
router.get('/auth/callback', async (req, res) => {
  try {
    const { code, state, shop } = req.query;
    
    if (!code || !shop) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const tenant = await oauthService.completeOAuth(shop, code, state);
    
    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}?connected=true&tenantId=${tenant.id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}?error=oauth_failed`);
  }
});

// POST /api/webhooks/:tenantId - Handle Shopify webhooks
router.post('/webhooks/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const topic = req.headers['x-shopify-topic'];
    const signature = req.headers['x-shopify-hmac-sha256'];

    if (!topic) {
      return res.status(400).json({ error: 'Missing webhook topic' });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: parseInt(tenantId) },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Verify webhook signature if webhook secret is available
    if (tenant.webhookSecret && signature) {
      const isValid = WebhookService.verifyWebhook(
        JSON.stringify(req.body),
        signature,
        tenant.webhookSecret
      );
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
    }

    // Process webhook asynchronously
    WebhookService.handleWebhook(tenantId, topic, req.body);

    res.status(200).json({ message: 'Webhook received' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// POST /api/events - Create custom events
router.post('/events', identifyTenant, async (req, res) => {
  try {
    const { eventType, customerId, eventData, value } = req.body;

    if (!eventType) {
      return res.status(400).json({ error: 'eventType is required' });
    }

    const event = await prisma.customEvent.create({
      data: {
        tenantId: req.tenant.id,
        customerId,
        eventType,
        eventData: eventData || {},
        value,
      },
    });

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// GET /api/events - Get custom events
router.get('/events', identifyTenant, async (req, res) => {
  try {
    const { from, to } = parseDateRange(req);
    const { eventType, customerId } = req.query;

    const where = {
      tenantId: req.tenant.id,
      createdAt: { gte: from, lte: to },
    };

    if (eventType) where.eventType = eventType;
    if (customerId) where.customerId = parseInt(customerId);

    const events = await prisma.customEvent.findMany({
      where,
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/customers - fetch all customers for tenant
router.get('/customers', identifyTenant, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { tenantId: req.tenant.id },
    });
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/products - fetch all products for tenant
router.get('/products', identifyTenant, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { tenantId: req.tenant.id },
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/orders - fetch all orders for tenant (with optional date filtering)
router.get('/orders', identifyTenant, async (req, res) => {
  try {
    const { from, to } = parseDateRange(req);

    const orders = await prisma.order.findMany({
      where: {
        tenantId: req.tenant.id,
        createdAt: { gte: from, lte: to },
      },
      include: { products: true, customer: true },
      orderBy: { createdAt: 'asc' },
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/insights - aggregated KPIs + trends
router.get('/insights', identifyTenant, async (req, res) => {
  try {
    const { from, to } = parseDateRange(req);
    const tenantId = req.tenant.id;

    // Basic totals
    const [totalCustomers, totalOrders, revenueAgg, totalProducts] = await Promise.all([
      prisma.customer.count({ where: { tenantId } }),
      prisma.order.count({ where: { tenantId, createdAt: { gte: from, lte: to } } }),
      prisma.order.aggregate({
        where: { tenantId, createdAt: { gte: from, lte: to } },
        _sum: { total: true },
      }),
      prisma.product.count({ where: { tenantId } }),
    ]);

    const totalRevenue = revenueAgg._sum?.total || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Orders for analysis
    const orders = await prisma.order.findMany({
      where: { tenantId, createdAt: { gte: from, lte: to } },
      include: { customer: true, products: true },
      orderBy: { createdAt: 'asc' },
    });

    // Revenue by date
    const ordersByDateMap = {};
    for (const o of orders) {
      const d = new Date(o.createdAt);
      const key = d.toISOString().slice(0, 10);
      ordersByDateMap[key] = (ordersByDateMap[key] || 0) + (o.total || 0);
    }
    const ordersByDate = Object.entries(ordersByDateMap)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top customers by spend
    const topCustomerGroups = await prisma.order.groupBy({
      by: ['customerId'],
      where: { tenantId, customerId: { not: null }, createdAt: { gte: from, lte: to } },
      _sum: { total: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 5,
    });

    const customerIds = topCustomerGroups.map(g => g.customerId).filter(Boolean);
    const topCustomersData = customerIds.length
      ? await prisma.customer.findMany({ where: { id: { in: customerIds } } })
      : [];

    const topCustomers = topCustomerGroups.map(g => {
      const c = topCustomersData.find(cu => cu.id === g.customerId);
      return {
        customerId: g.customerId,
        name: c?.name || c?.email || `Customer ${g.customerId}`,
        total: g._sum.total || 0,
        ordersCount: orders.filter(o => o.customerId === g.customerId).length,
      };
    });

    // Top products by revenue
    const productRevenue = {};
    for (const order of orders) {
      for (const product of order.products) {
        const productId = product.id;
        if (!productRevenue[productId]) {
          productRevenue[productId] = {
            id: product.id,
            title: product.title,
            revenue: 0,
            units: 0,
            price: product.price,
          };
        }
        productRevenue[productId].revenue += order.total / order.products.length;
        productRevenue[productId].units += 1;
      }
    }

    const topProducts = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Repeat customers
    const customerOrderCounts = {};
    for (const order of orders) {
      const customerId = order.customerId;
      customerOrderCounts[customerId] = (customerOrderCounts[customerId] || 0) + 1;
    }
    const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;

    // Custom events summary
    const customEvents = await prisma.customEvent.findMany({
      where: { tenantId, createdAt: { gte: from, lte: to } },
      select: { eventType: true, value: true },
    });

    const eventSummary = {};
    for (const event of customEvents) {
      if (!eventSummary[event.eventType]) {
        eventSummary[event.eventType] = { count: 0, totalValue: 0 };
      }
      eventSummary[event.eventType].count += 1;
      eventSummary[event.eventType].totalValue += event.value || 0;
    }

    // Revenue growth calculation
    const currentPeriodRevenue = totalRevenue;
    const previousPeriodStart = new Date(from);
    const previousPeriodEnd = new Date(to);
    const periodLength = previousPeriodEnd.getTime() - previousPeriodStart.getTime();
    previousPeriodStart.setTime(previousPeriodStart.getTime() - periodLength);
    previousPeriodEnd.setTime(previousPeriodEnd.getTime() - periodLength);

    const previousRevenueAgg = await prisma.order.aggregate({
      where: { 
        tenantId, 
        createdAt: { 
          gte: previousPeriodStart, 
          lte: previousPeriodEnd 
        } 
      },
      _sum: { total: true },
    });

    const previousRevenue = previousRevenueAgg._sum?.total || 0;
    const revenueGrowth = previousRevenue > 0 
      ? ((currentPeriodRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    res.json({
      // Basic KPIs
      totalCustomers,
      totalOrders,
      totalRevenue,
      totalProducts,
      averageOrderValue,
      repeatCustomers,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      
      // Charts data
      ordersByDate,
      topCustomers,
      topProducts,
      
      // Custom events
      customEvents: eventSummary,
      
      // Additional metrics
      orders, // Full orders list for detailed analysis
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute insights' });
  }
});

module.exports = router;

