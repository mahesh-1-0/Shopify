const crypto = require('crypto');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class OAuthService {
  constructor() {
    this.clientId = process.env.SHOPIFY_CLIENT_ID;
    this.clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
    this.scopes = 'read_products,read_orders,read_customers,read_checkouts';
    this.redirectUri = process.env.SHOPIFY_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
  }

  // Generate OAuth URL
  generateAuthUrl(shopDomain) {
    const state = crypto.randomBytes(16).toString('hex');
    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: this.scopes,
      redirect_uri: this.redirectUri,
      state,
      'grant_options[]': 'per-user',
    });

    return {
      url: `https://${shopDomain}/admin/oauth/authorize?${params.toString()}`,
      state,
    };
  }

  // Exchange code for access token
  async exchangeCodeForToken(shopDomain, code) {
    try {
      const response = await axios.post(`https://${shopDomain}/admin/oauth/access_token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
      });

      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get shop information
  async getShopInfo(shopDomain, accessToken) {
    try {
      const response = await axios.get(`https://${shopDomain}/admin/api/2024-01/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
        },
      });

      return response.data.shop;
    } catch (error) {
      console.error('Error fetching shop info:', error.response?.data || error.message);
      throw error;
    }
  }

  // Complete OAuth flow
  async completeOAuth(shopDomain, code, state) {
    try {
      // Exchange code for access token
      const tokenData = await this.exchangeCodeForToken(shopDomain, code);
      
      // Get shop information
      const shopInfo = await this.getShopInfo(shopDomain, tokenData.access_token);

      // Create or update tenant
      const tenant = await prisma.tenant.upsert({
        where: { shopifyDomain: shopDomain },
        update: {
          name: shopInfo.name,
          accessToken: tokenData.access_token,
          webhookSecret: crypto.randomBytes(32).toString('hex'),
        },
        create: {
          name: shopInfo.name,
          shopifyDomain: shopDomain,
          accessToken: tokenData.access_token,
          webhookSecret: crypto.randomBytes(32).toString('hex'),
          apiKey: crypto.randomBytes(16).toString('hex'),
        },
      });

      return tenant;
    } catch (error) {
      console.error('Error completing OAuth:', error);
      throw error;
    }
  }

  // Verify access token
  async verifyAccessToken(shopDomain, accessToken) {
    try {
      await this.getShopInfo(shopDomain, accessToken);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = OAuthService;
