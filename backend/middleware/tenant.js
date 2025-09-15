const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function identifyTenant(req, res, next) {
  const apiKey = req.query.apiKey; // or from headers if you prefer

  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { apiKey: apiKey },
  });

  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  req.tenant = tenant; // attach tenant to request
  next();
}

module.exports = identifyTenant;
