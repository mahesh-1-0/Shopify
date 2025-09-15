var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.json({ message: 'Shopify Insights API is running 🚀' });
});


module.exports = router;
