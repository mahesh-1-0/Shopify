const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1️⃣ Create multiple demo tenants (shops/stores)
  const tenants = [
    {
      name: "Fashion Forward Store",
      apiKey: "fashion-store-456",
      shopifyDomain: "fashion-forward.myshopify.com",
    },
    {
      name: "Tech Gadgets Hub",
      apiKey: "tech-store-789",
      shopifyDomain: "tech-gadgets.myshopify.com",
    },
    {
      name: "Home & Garden Co",
      apiKey: "home-store-101",
      shopifyDomain: "home-garden.myshopify.com",
    },
    {
      name: "Sports & Fitness",
      apiKey: "sports-store-202",
      shopifyDomain: "sports-fitness.myshopify.com",
    },
    {
      name: "Beauty & Wellness",
      apiKey: "beauty-store-303",
      shopifyDomain: "beauty-wellness.myshopify.com",
    }
  ];

  const createdTenants = [];
  for (const tenantData of tenants) {
    const tenant = await prisma.tenant.upsert({
      where: { apiKey: tenantData.apiKey },
      update: {},
      create: tenantData,
    });
    createdTenants.push(tenant);
  }

  // 2️⃣ Create different customers for each store
  const storeCustomers = {
    "fashion-store-456": [
      { shopifyId: "fashion_cust_001", name: "Sarah Fashion", email: "sarah@fashion.com", phone: "+1-555-1001", totalSpent: 850.00, ordersCount: 4 },
      { shopifyId: "fashion_cust_002", name: "Mike Style", email: "mike@fashion.com", phone: "+1-555-1002", totalSpent: 420.50, ordersCount: 2 },
      { shopifyId: "fashion_cust_003", name: "Lisa Trendy", email: "lisa@fashion.com", phone: "+1-555-1003", totalSpent: 680.75, ordersCount: 3 },
    ],
    "tech-store-789": [
      { shopifyId: "tech_cust_001", name: "Alex Tech", email: "alex@tech.com", phone: "+1-555-2001", totalSpent: 1200.00, ordersCount: 3 },
      { shopifyId: "tech_cust_002", name: "Emma Gadget", email: "emma@tech.com", phone: "+1-555-2002", totalSpent: 750.25, ordersCount: 2 },
      { shopifyId: "tech_cust_003", name: "David Geek", email: "david@tech.com", phone: "+1-555-2003", totalSpent: 950.50, ordersCount: 4 },
    ],
    "home-store-101": [
      { shopifyId: "home_cust_001", name: "Maria Home", email: "maria@home.com", phone: "+1-555-3001", totalSpent: 320.00, ordersCount: 2 },
      { shopifyId: "home_cust_002", name: "John Garden", email: "john@home.com", phone: "+1-555-3002", totalSpent: 180.75, ordersCount: 1 },
      { shopifyId: "home_cust_003", name: "Anna Decor", email: "anna@home.com", phone: "+1-555-3003", totalSpent: 450.25, ordersCount: 3 },
    ],
    "sports-store-202": [
      { shopifyId: "sports_cust_001", name: "Tom Athlete", email: "tom@sports.com", phone: "+1-555-4001", totalSpent: 680.00, ordersCount: 3 },
      { shopifyId: "sports_cust_002", name: "Lisa Fitness", email: "lisa@sports.com", phone: "+1-555-4002", totalSpent: 420.50, ordersCount: 2 },
      { shopifyId: "sports_cust_003", name: "Chris Runner", email: "chris@sports.com", phone: "+1-555-4003", totalSpent: 350.75, ordersCount: 2 },
    ],
    "beauty-store-303": [
      { shopifyId: "beauty_cust_001", name: "Sophia Beauty", email: "sophia@beauty.com", phone: "+1-555-5001", totalSpent: 520.00, ordersCount: 3 },
      { shopifyId: "beauty_cust_002", name: "Emma Glow", email: "emma@beauty.com", phone: "+1-555-5002", totalSpent: 280.25, ordersCount: 2 },
      { shopifyId: "beauty_cust_003", name: "Maya Wellness", email: "maya@beauty.com", phone: "+1-555-5003", totalSpent: 380.50, ordersCount: 2 },
    ]
  };

  // Create customers for each store
  for (const tenant of createdTenants) {
    const customersData = storeCustomers[tenant.apiKey] || [];
    for (const c of customersData) {
      await prisma.customer.upsert({
        where: { shopifyId: c.shopifyId },
        update: {},
        create: { ...c, tenantId: tenant.id, state: "enabled" },
      });
    }
  }

  // 3️⃣ Create store-specific products
  const storeProducts = {
    "fashion-store-456": [
      { shopifyId: "fashion_prod_001", title: "Designer Dress", price: 89.99, compareAtPrice: 120.00, sku: "FASH-001", inventory: 25, productType: "Apparel", vendor: "Fashion Co", tags: "dress,designer,women", imageUrl: "https://via.placeholder.com/300x300?text=Dress" },
      { shopifyId: "fashion_prod_002", title: "Leather Jacket", price: 149.99, sku: "FASH-002", inventory: 15, productType: "Apparel", vendor: "Fashion Co", tags: "jacket,leather,men", imageUrl: "https://via.placeholder.com/300x300?text=Jacket" },
      { shopifyId: "fashion_prod_003", title: "Sneakers", price: 79.99, sku: "FASH-003", inventory: 50, productType: "Footwear", vendor: "Fashion Co", tags: "sneakers,shoes,casual", imageUrl: "https://via.placeholder.com/300x300?text=Sneakers" },
    ],
    "tech-store-789": [
      { shopifyId: "tech_prod_001", title: "Smartphone", price: 699.99, compareAtPrice: 799.99, sku: "TECH-001", inventory: 20, productType: "Electronics", vendor: "Tech Co", tags: "phone,smartphone,mobile", imageUrl: "https://via.placeholder.com/300x300?text=Phone" },
      { shopifyId: "tech_prod_002", title: "Laptop", price: 1299.99, sku: "TECH-002", inventory: 10, productType: "Electronics", vendor: "Tech Co", tags: "laptop,computer,work", imageUrl: "https://via.placeholder.com/300x300?text=Laptop" },
      { shopifyId: "tech_prod_003", title: "Wireless Earbuds", price: 199.99, sku: "TECH-003", inventory: 30, productType: "Electronics", vendor: "Tech Co", tags: "earbuds,wireless,audio", imageUrl: "https://via.placeholder.com/300x300?text=Earbuds" },
    ],
    "home-store-101": [
      { shopifyId: "home_prod_001", title: "Coffee Maker", price: 89.99, sku: "HOME-001", inventory: 25, productType: "Kitchen", vendor: "Home Co", tags: "coffee,kitchen,appliance", imageUrl: "https://via.placeholder.com/300x300?text=Coffee+Maker" },
      { shopifyId: "home_prod_002", title: "Throw Pillow", price: 24.99, sku: "HOME-002", inventory: 40, productType: "Decor", vendor: "Home Co", tags: "pillow,decor,comfort", imageUrl: "https://via.placeholder.com/300x300?text=Pillow" },
      { shopifyId: "home_prod_003", title: "Plant Pot", price: 19.99, sku: "HOME-003", inventory: 60, productType: "Garden", vendor: "Home Co", tags: "pot,plant,garden", imageUrl: "https://via.placeholder.com/300x300?text=Pot" },
    ],
    "sports-store-202": [
      { shopifyId: "sports_prod_001", title: "Running Shoes", price: 129.99, sku: "SPORT-001", inventory: 35, productType: "Footwear", vendor: "Sports Co", tags: "running,shoes,athletic", imageUrl: "https://via.placeholder.com/300x300?text=Running+Shoes" },
      { shopifyId: "sports_prod_002", title: "Dumbbells Set", price: 79.99, sku: "SPORT-002", inventory: 20, productType: "Fitness", vendor: "Sports Co", tags: "dumbbells,weights,fitness", imageUrl: "https://via.placeholder.com/300x300?text=Dumbbells" },
      { shopifyId: "sports_prod_003", title: "Yoga Mat", price: 39.99, sku: "SPORT-003", inventory: 50, productType: "Fitness", vendor: "Sports Co", tags: "yoga,mat,fitness", imageUrl: "https://via.placeholder.com/300x300?text=Yoga+Mat" },
    ],
    "beauty-store-303": [
      { shopifyId: "beauty_prod_001", title: "Face Cream", price: 49.99, sku: "BEAUTY-001", inventory: 40, productType: "Skincare", vendor: "Beauty Co", tags: "cream,face,skincare", imageUrl: "https://via.placeholder.com/300x300?text=Face+Cream" },
      { shopifyId: "beauty_prod_002", title: "Lipstick Set", price: 29.99, sku: "BEAUTY-002", inventory: 30, productType: "Makeup", vendor: "Beauty Co", tags: "lipstick,makeup,beauty", imageUrl: "https://via.placeholder.com/300x300?text=Lipstick" },
      { shopifyId: "beauty_prod_003", title: "Essential Oils", price: 34.99, sku: "BEAUTY-003", inventory: 25, productType: "Wellness", vendor: "Beauty Co", tags: "oils,essential,wellness", imageUrl: "https://via.placeholder.com/300x300?text=Oils" },
    ]
  };

  // Create products for each store
  for (const tenant of createdTenants) {
    const productsData = storeProducts[tenant.apiKey] || [];
  for (const p of productsData) {
      await prisma.product.upsert({
      where: { shopifyId: p.shopifyId },
      update: {},
        create: { ...p, tenantId: tenant.id, status: "active" },
      });
    }
  }

  // 4️⃣ Create store-specific orders and custom events
  for (const tenant of createdTenants) {
    // Get customers and products for this tenant
    const tenantCustomers = await prisma.customer.findMany({ where: { tenantId: tenant.id } });
    const tenantProducts = await prisma.product.findMany({ where: { tenantId: tenant.id } });
    
    if (tenantCustomers.length > 0 && tenantProducts.length > 0) {
      // Create 2-3 orders per store
      const orderCount = Math.min(3, tenantCustomers.length);
      for (let i = 0; i < orderCount; i++) {
        const customer = tenantCustomers[i];
        const product = tenantProducts[i % tenantProducts.length];
        const orderNumber = `${tenant.apiKey.slice(-3)}${100 + i}`;
        
        await prisma.order.upsert({
          where: { shopifyId: `${tenant.apiKey}_order_${i + 1}` },
          update: {},
          create: {
            shopifyId: `${tenant.apiKey}_order_${i + 1}`,
            tenantId: tenant.id,
            customerId: customer.id,
            orderNumber,
            financialStatus: "paid",
            fulfillmentStatus: "fulfilled",
            subtotal: product.price,
            totalTax: product.price * 0.08,
            totalDiscounts: 0,
            total: product.price * 1.08,
            shippingCost: product.price > 50 ? 0 : 5.99,
            processedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Spread over last few days
            products: {
              connect: [{ id: product.id }],
            },
          },
        });
      }
      
      // Create custom events for this store
      const eventTypes = ['cart_abandoned', 'checkout_started', 'product_viewed'];
      for (let i = 0; i < 2; i++) {
        const customer = tenantCustomers[i % tenantCustomers.length];
        const product = tenantProducts[i % tenantProducts.length];
        
        await prisma.customEvent.create({
          data: {
            tenantId: tenant.id,
            customerId: customer.id,
            eventType: eventTypes[i % eventTypes.length],
            eventData: {
              productId: product.id,
              productTitle: product.title,
            },
            value: product.price,
          },
        });
      }
    }
  }

  console.log("Database seeded successfully!");
  console.log(`- Created ${createdTenants.length} demo stores`);
  console.log("- Each store has 3 customers, 3 products, 2-3 orders, and 2 custom events");
  console.log("\n🎯 Available Demo Stores:");
  for (const tenant of createdTenants) {
    console.log(`  - ${tenant.name}: API Key "${tenant.apiKey}"`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
