const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const ShopifyService = require('./shopifyService');

const prisma = new PrismaClient();

class WebhookService {
  // Verify webhook signature
  static verifyWebhook(data, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(data, 'utf8');
    const hash = hmac.digest('base64');
    return hash === signature;
  }

  // Handle customer webhook
  static async handleCustomerWebhook(tenantId, webhookData) {
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (!tenant) {
        console.error(`Tenant ${tenantId} not found`);
        return;
      }

      const shopifyService = new ShopifyService(tenant);
      await shopifyService.syncCustomers();
      console.log('Customer webhook processed successfully');
    } catch (error) {
      console.error('Error processing customer webhook:', error);
    }
  }

  // Handle product webhook
  static async handleProductWebhook(tenantId, webhookData) {
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (!tenant) {
        console.error(`Tenant ${tenantId} not found`);
        return;
      }

      const shopifyService = new ShopifyService(tenant);
      await shopifyService.syncProducts();
      console.log('Product webhook processed successfully');
    } catch (error) {
      console.error('Error processing product webhook:', error);
    }
  }

  // Handle order webhook
  static async handleOrderWebhook(tenantId, webhookData) {
    try {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (!tenant) {
        console.error(`Tenant ${tenantId} not found`);
        return;
      }

      const shopifyService = new ShopifyService(tenant);
      await shopifyService.syncOrders();
      console.log('Order webhook processed successfully');
    } catch (error) {
      console.error('Error processing order webhook:', error);
    }
  }

  // Handle cart abandoned event
  static async handleCartAbandoned(tenantId, webhookData) {
    try {
      const customer = await prisma.customer.findFirst({
        where: {
          tenantId,
          email: webhookData.email,
        },
      });

      if (customer) {
        await prisma.customEvent.create({
          data: {
            tenantId,
            customerId: customer.id,
            eventType: 'cart_abandoned',
            eventData: {
              cartToken: webhookData.cart_token,
              abandonedCheckoutUrl: webhookData.abandoned_checkout_url,
              lineItems: webhookData.line_items,
            },
            value: parseFloat(webhookData.total_price || 0),
          },
        });
        console.log('Cart abandoned event recorded');
      }
    } catch (error) {
      console.error('Error processing cart abandoned event:', error);
    }
  }

  // Handle checkout started event
  static async handleCheckoutStarted(tenantId, webhookData) {
    try {
      const customer = await prisma.customer.findFirst({
        where: {
          tenantId,
          email: webhookData.email,
        },
      });

      if (customer) {
        await prisma.customEvent.create({
          data: {
            tenantId,
            customerId: customer.id,
            eventType: 'checkout_started',
            eventData: {
              checkoutToken: webhookData.token,
              lineItems: webhookData.line_items,
            },
            value: parseFloat(webhookData.total_price || 0),
          },
        });
        console.log('Checkout started event recorded');
      }
    } catch (error) {
      console.error('Error processing checkout started event:', error);
    }
  }

  // Generic webhook handler
  static async handleWebhook(tenantId, topic, data) {
    switch (topic) {
      case 'customers/create':
      case 'customers/update':
        await this.handleCustomerWebhook(tenantId, data);
        break;
      case 'products/create':
      case 'products/update':
        await this.handleProductWebhook(tenantId, data);
        break;
      case 'orders/create':
      case 'orders/updated':
      case 'orders/paid':
        await this.handleOrderWebhook(tenantId, data);
        break;
      case 'checkouts/create':
        await this.handleCheckoutStarted(tenantId, data);
        break;
      case 'checkouts/update':
        if (data.abandoned_checkout_url) {
          await this.handleCartAbandoned(tenantId, data);
        }
        break;
      default:
        console.log(`Unhandled webhook topic: ${topic}`);
    }
  }
}

module.exports = WebhookService;
