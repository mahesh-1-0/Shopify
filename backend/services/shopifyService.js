const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ShopifyService {
  constructor(tenant) {
    this.tenant = tenant;
    this.baseURL = `https://${tenant.shopifyDomain}/admin/api/2024-01`;
    this.headers = {
      'X-Shopify-Access-Token': tenant.accessToken,
      'Content-Type': 'application/json',
    };
  }

  // Fetch customers from Shopify
  async fetchCustomers() {
    try {
      const response = await axios.get(`${this.baseURL}/customers.json`, {
        headers: this.headers,
      });
      return response.data.customers;
    } catch (error) {
      console.error('Error fetching customers:', error.response?.data || error.message);
      throw error;
    }
  }

  // Fetch products from Shopify
  async fetchProducts() {
    try {
      const response = await axios.get(`${this.baseURL}/products.json`, {
        headers: this.headers,
      });
      return response.data.products;
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
      throw error;
    }
  }

  // Fetch orders from Shopify
  async fetchOrders(limit = 250, status = 'any') {
    try {
      const response = await axios.get(`${this.baseURL}/orders.json`, {
        headers: this.headers,
        params: {
          limit,
          status,
          financial_status: 'any',
        },
      });
      return response.data.orders;
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      throw error;
    }
  }

  // Sync customers to database
  async syncCustomers() {
    const shopifyCustomers = await this.fetchCustomers();
    const syncedCustomers = [];

    for (const shopifyCustomer of shopifyCustomers) {
      const customer = await prisma.customer.upsert({
        where: { shopifyId: shopifyCustomer.id.toString() },
        update: {
          name: `${shopifyCustomer.first_name || ''} ${shopifyCustomer.last_name || ''}`.trim(),
          email: shopifyCustomer.email,
          phone: shopifyCustomer.phone,
          totalSpent: parseFloat(shopifyCustomer.total_spent || 0),
          ordersCount: shopifyCustomer.orders_count || 0,
          state: shopifyCustomer.state,
        },
        create: {
          tenantId: this.tenant.id,
          shopifyId: shopifyCustomer.id.toString(),
          name: `${shopifyCustomer.first_name || ''} ${shopifyCustomer.last_name || ''}`.trim(),
          email: shopifyCustomer.email,
          phone: shopifyCustomer.phone,
          totalSpent: parseFloat(shopifyCustomer.total_spent || 0),
          ordersCount: shopifyCustomer.orders_count || 0,
          state: shopifyCustomer.state,
        },
      });
      syncedCustomers.push(customer);
    }

    return syncedCustomers;
  }

  // Sync products to database
  async syncProducts() {
    const shopifyProducts = await this.fetchProducts();
    const syncedProducts = [];

    for (const shopifyProduct of shopifyProducts) {
      const product = await prisma.product.upsert({
        where: { shopifyId: shopifyProduct.id.toString() },
        update: {
          title: shopifyProduct.title,
          price: parseFloat(shopifyProduct.variants[0]?.price || 0),
          compareAtPrice: shopifyProduct.variants[0]?.compare_at_price 
            ? parseFloat(shopifyProduct.variants[0].compare_at_price) 
            : null,
          sku: shopifyProduct.variants[0]?.sku,
          inventory: shopifyProduct.variants[0]?.inventory_quantity || 0,
          status: shopifyProduct.status,
          productType: shopifyProduct.product_type,
          vendor: shopifyProduct.vendor,
          tags: shopifyProduct.tags,
          imageUrl: shopifyProduct.image?.src,
        },
        create: {
          tenantId: this.tenant.id,
          shopifyId: shopifyProduct.id.toString(),
          title: shopifyProduct.title,
          price: parseFloat(shopifyProduct.variants[0]?.price || 0),
          compareAtPrice: shopifyProduct.variants[0]?.compare_at_price 
            ? parseFloat(shopifyProduct.variants[0].compare_at_price) 
            : null,
          sku: shopifyProduct.variants[0]?.sku,
          inventory: shopifyProduct.variants[0]?.inventory_quantity || 0,
          status: shopifyProduct.status,
          productType: shopifyProduct.product_type,
          vendor: shopifyProduct.vendor,
          tags: shopifyProduct.tags,
          imageUrl: shopifyProduct.image?.src,
        },
      });
      syncedProducts.push(product);
    }

    return syncedProducts;
  }

  // Sync orders to database
  async syncOrders() {
    const shopifyOrders = await this.fetchOrders();
    const syncedOrders = [];

    for (const shopifyOrder of shopifyOrders) {
      // Find or create customer
      let customer = await prisma.customer.findUnique({
        where: { 
          shopifyId: shopifyOrder.customer?.id?.toString(),
          tenantId: this.tenant.id,
        },
      });

      if (!customer && shopifyOrder.customer) {
        customer = await prisma.customer.create({
          data: {
            tenantId: this.tenant.id,
            shopifyId: shopifyOrder.customer.id.toString(),
            name: `${shopifyOrder.customer.first_name || ''} ${shopifyOrder.customer.last_name || ''}`.trim(),
            email: shopifyOrder.customer.email,
            phone: shopifyOrder.customer.phone,
          },
        });
      }

      if (!customer) continue; // Skip orders without customers

      // Create order
      const order = await prisma.order.upsert({
        where: { shopifyId: shopifyOrder.id.toString() },
        update: {
          customerId: customer.id,
          orderNumber: shopifyOrder.order_number?.toString(),
          financialStatus: shopifyOrder.financial_status,
          fulfillmentStatus: shopifyOrder.fulfillment_status,
          currency: shopifyOrder.currency,
          subtotal: parseFloat(shopifyOrder.subtotal_price || 0),
          totalTax: parseFloat(shopifyOrder.total_tax || 0),
          totalDiscounts: parseFloat(shopifyOrder.total_discounts || 0),
          total: parseFloat(shopifyOrder.total_price || 0),
          shippingCost: parseFloat(shopifyOrder.shipping_lines?.reduce((sum, line) => sum + parseFloat(line.price || 0), 0) || 0),
          processedAt: shopifyOrder.processed_at ? new Date(shopifyOrder.processed_at) : null,
          cancelledAt: shopifyOrder.cancelled_at ? new Date(shopifyOrder.cancelled_at) : null,
          closedAt: shopifyOrder.closed_at ? new Date(shopifyOrder.closed_at) : null,
        },
        create: {
          tenantId: this.tenant.id,
          shopifyId: shopifyOrder.id.toString(),
          customerId: customer.id,
          orderNumber: shopifyOrder.order_number?.toString(),
          financialStatus: shopifyOrder.financial_status,
          fulfillmentStatus: shopifyOrder.fulfillment_status,
          currency: shopifyOrder.currency,
          subtotal: parseFloat(shopifyOrder.subtotal_price || 0),
          totalTax: parseFloat(shopifyOrder.total_tax || 0),
          totalDiscounts: parseFloat(shopifyOrder.total_discounts || 0),
          total: parseFloat(shopifyOrder.total_price || 0),
          shippingCost: parseFloat(shopifyOrder.shipping_lines?.reduce((sum, line) => sum + parseFloat(line.price || 0), 0) || 0),
          processedAt: shopifyOrder.processed_at ? new Date(shopifyOrder.processed_at) : null,
          cancelledAt: shopifyOrder.cancelled_at ? new Date(shopifyOrder.cancelled_at) : null,
          closedAt: shopifyOrder.closed_at ? new Date(shopifyOrder.closed_at) : null,
        },
      });

      // Connect products to order
      if (shopifyOrder.line_items) {
        const productIds = [];
        for (const lineItem of shopifyOrder.line_items) {
          const product = await prisma.product.findUnique({
            where: { 
              shopifyId: lineItem.product_id?.toString(),
              tenantId: this.tenant.id,
            },
          });
          if (product) {
            productIds.push(product.id);
          }
        }
        
        if (productIds.length > 0) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              products: {
                set: productIds.map(id => ({ id })),
              },
            },
          });
        }
      }

      syncedOrders.push(order);
    }

    return syncedOrders;
  }

  // Full sync - sync all data
// REPLACE the existing fullSync function at the bottom of the file with this one

  async fullSync() {
    console.log(`Starting full sync for tenant: ${this.tenant.name}`);

    // CHECK if this is a demo store by looking for '-store-' in the API key
    if (this.tenant.apiKey.includes('-store-')) {
      console.log(`Tenant '${this.tenant.name}' is a demo store. Skipping live Shopify API call.`);
      
      // For a demo, we don't need to fetch anything.
      // We just count the data already in our database from the seed script.
      const [customerCount, productCount, orderCount] = await Promise.all([
          prisma.customer.count({ where: { tenantId: this.tenant.id } }),
          prisma.product.count({ where: { tenantId: this.tenant.id } }),
          prisma.order.count({ where: { tenantId: this.tenant.id } })
      ]);

      console.log(`Sync completed for demo tenant: ${this.tenant.name}`);
      console.log(`- Customers found in DB: ${customerCount}`);
      console.log(`- Products found in DB: ${productCount}`);
      console.log(`- Orders found in DB: ${orderCount}`);

      return {
          customers: customerCount,
          products: productCount,
          orders: orderCount,
      };
    }

    // --- This part below is for REAL stores and remains unchanged ---
    // If it's not a demo store, the original logic will run.
    console.log(`Tenant '${this.tenant.name}' is a live store. Starting Shopify API sync...`);
    try {
      const [customers, products, orders] = await Promise.all([
        this.syncCustomers(),
        this.syncProducts(),
        this.syncOrders(),
      ]);

      console.log(`Sync completed for tenant: ${this.tenant.name}`);
      console.log(`- Customers: ${customers.length}`);
      console.log(`- Products: ${products.length}`);
      console.log(`- Orders: ${orders.length}`);

      return {
        customers: customers.length,
        products: products.length,
        orders: orders.length,
      };
    } catch (error) {
      console.error(`Sync failed for tenant: ${this.tenant.name}`, error);
      throw error;
    }
  }

  // Create custom event
  async createCustomEvent(eventType, customerId, eventData = {}, value = null) {
    return await prisma.customEvent.create({
      data: {
        tenantId: this.tenant.id,
        customerId,
        eventType,
        eventData,
        value,
      },
    });
  }
}

module.exports = ShopifyService;
