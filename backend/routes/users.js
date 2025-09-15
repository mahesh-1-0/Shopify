var express = require('express');
var router = express.Router();
const prisma = require('../prisma/client'); // import Prisma

// Example route: get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
