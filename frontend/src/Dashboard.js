// src/Dashboard.js
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Select,
  MenuItem,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  Paper,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  CircularProgress, // Corrected import location
} from '@mui/material';
import {
  Download as DownloadIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
  Store as StoreIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  ShoppingBag as ShoppingBagIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Label,
} from 'recharts';

// (The rest of your file remains the same)
// ...
// AdminLTE-inspired color palette
const COLORS = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  info: '#17a2b8',
  warning: '#ffc107',
  danger: '#dc3545',
  light: '#f8f9fa',
  dark: '#343a40',
  indigo: '#6610f2',
  purple: '#6f42c1',
  pink: '#e83e8c',
  red: '#dc3545',
  orange: '#fd7e14',
  yellow: '#ffc107',
  green: '#28a745',
  teal: '#20c997',
  cyan: '#17a2b8',
  blue: '#007bff',
  white: '#ffffff',
  gray: '#6c757d',
  grayDark: '#343a40',
  lightBlue: '#3c8dbc',
  navy: '#001f3f',
  olive: '#3d9970',
  lime: '#01ff70',
  fuchsia: '#f012be',
  maroon: '#d81b60',
};

const GRADIENT_COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

function formatCurrency(n) {
  return `₹${Number(n || 0).toFixed(2)}`;
}

function LoginModal({ open, onClose, onSave }) {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('fashion-store-456');
  const [shopDomain, setShopDomain] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSave = () => {
    if (!email) return;
    onSave({ email, apiKey });
    onClose();
  };

  const handleShopifyConnect = async () => {
    if (!shopDomain || !apiKey) return;

    setIsConnecting(true);
    try {
      const response = await axios.get(`/api/auth/url?shopDomain=${shopDomain}&apiKey=${apiKey}`);
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Error connecting to Shopify:', error);
      alert('Failed to connect to Shopify. Please check your shop domain and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const demoStores = [
    { key: 'fashion-store-456', name: 'Fashion Forward Store', color: COLORS.pink },
    { key: 'tech-store-789', name: 'Tech Gadgets Hub', color: COLORS.blue },
    { key: 'home-store-101', name: 'Home & Garden Co', color: COLORS.green },
    { key: 'sports-store-202', name: 'Sports & Fitness', color: COLORS.orange },
    { key: 'beauty-store-303', name: 'Beauty & Wellness', color: COLORS.purple },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 3,
        textAlign: 'center'
      }}>
        <StoreIcon sx={{ fontSize: 48, mb: 2 }} />
        <DialogTitle sx={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
          🏪 Shopify Insights Platform
        </DialogTitle>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
          Connect your store and unlock powerful analytics
        </Typography>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={4}>
          {/* Real Shopify Connection */}
          <Paper elevation={3} sx={{ p: 3, border: `2px solid ${COLORS.primary}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StoreIcon sx={{ color: COLORS.primary, mr: 1 }} />
              <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
                Connect Real Shopify Store
              </Typography>
            </Box>
            <Stack spacing={2}>
              <TextField
                label="Shop Domain"
                value={shopDomain}
                onChange={(e) => setShopDomain(e.target.value)}
                placeholder="your-store.myshopify.com"
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: COLORS.primary },
                    '&.Mui-focused fieldset': { borderColor: COLORS.primary },
                  }
                }}
              />
              <TextField
                label="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: COLORS.primary },
                    '&.Mui-focused fieldset': { borderColor: COLORS.primary },
                  }
                }}
              />
              <Button
                onClick={handleShopifyConnect}
                variant="contained"
                fullWidth
                disabled={isConnecting || !shopDomain || !apiKey}
                sx={{
                  background: `linear-gradient(45deg, ${COLORS.primary} 30%, ${COLORS.info} 90%)`,
                  height: 48,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: `linear-gradient(45deg, ${COLORS.info} 30%, ${COLORS.primary} 90%)`,
                  }
                }}
              >
                {isConnecting ? 'Connecting...' : 'Connect to Shopify'}
              </Button>
            </Stack>
          </Paper>

          <Divider>
            <Chip label="OR" sx={{ bgcolor: COLORS.light, fontWeight: 'bold' }} />
          </Divider>

          {/* Demo Store Selection */}
          <Paper elevation={3} sx={{ p: 3, border: `2px solid ${COLORS.success}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AnalyticsIcon sx={{ color: COLORS.success, mr: 1 }} />
              <Typography variant="h6" sx={{ color: COLORS.success, fontWeight: 'bold' }}>
                Try Demo Stores
              </Typography>
            </Box>

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
              variant="outlined"
            />

            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Choose a Demo Store:
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {demoStores.map((store) => (
                <Grid item xs={12} sm={6} key={store.key}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: apiKey === store.key ? `3px solid ${store.color}` : '1px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      }
                    }}
                    onClick={() => setApiKey(store.key)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: store.color, mr: 2, width: 32, height: 32 }}>
                          <StoreIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {store.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {store.key}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button
              onClick={handleSave}
              variant="contained"
              fullWidth
              disabled={!email}
              sx={{
                background: `linear-gradient(45deg, ${COLORS.success} 30%, ${COLORS.teal} 90%)`,
                height: 48,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  background: `linear-gradient(45deg, ${COLORS.teal} 30%, ${COLORS.success} 90%)`,
                }
              }}
            >
              Launch Demo Dashboard
            </Button>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: COLORS.light }}>
        <Button
          onClick={onClose}
          sx={{
            color: COLORS.gray,
            fontWeight: 'bold',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function Sidebar({ open, onClose, currentView, onViewChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon />, color: COLORS.primary },
    { id: 'customers', label: 'Customers', icon: <PeopleIcon />, color: COLORS.success },
    { id: 'products', label: 'Products', icon: <InventoryIcon />, color: COLORS.warning },
    { id: 'orders', label: 'Orders', icon: <ShoppingCartIcon />, color: COLORS.info },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon />, color: COLORS.purple },
    { id: 'events', label: 'Events', icon: <TimelineIcon />, color: COLORS.pink },
  ];

  const drawerContent = (
    <Box sx={{
      height: '100%',
      background: `linear-gradient(180deg, ${COLORS.dark} 0%, ${COLORS.grayDark} 100%)`,
      color: 'white'
    }}>
      {/* Logo Section */}
      <Box sx={{
        p: 3,
        textAlign: 'center',
        borderBottom: `1px solid ${COLORS.gray}`,
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.info} 100%)`
      }}>
        <StoreIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          XENO
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Shopify Insights 
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Analytics Dashboard
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            onClick={() => {
              onViewChange(item.id);
              if (isMobile) onClose();
            }}
            sx={{
              mb: 1,
              borderRadius: 2,
              cursor: 'pointer',
              background: currentView === item.id
                ? `linear-gradient(45deg, ${item.color}20, ${item.color}40)`
                : 'transparent',
              border: currentView === item.id ? `1px solid ${item.color}` : '1px solid transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: `linear-gradient(45deg, ${item.color}20, ${item.color}30)`,
                transform: 'translateX(4px)',
              }
            }}
          >
            <ListItemIcon sx={{ color: currentView === item.id ? item.color : 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: currentView === item.id ? 'bold' : 'normal',
                  color: currentView === item.id ? item.color : 'white',
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        borderTop: `1px solid ${COLORS.gray}`,
        background: `linear-gradient(135deg, ${COLORS.grayDark} 0%, ${COLORS.dark} 100%)`
      }}>
        <Typography variant="caption" sx={{ opacity: 0.7, textAlign: 'center', display: 'block' }}>
          Xeno FDE Internship Assignment
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7, textAlign: 'center', display: 'block' }}>
          Mahesh G - 22BCE1005
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [error, setError] = useState(null);

  // session stored in localStorage
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('session')) || null; } catch { return null; }
  });
  const [showLogin, setShowLogin] = useState(!session);

  // date filter
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // AdminLTE sidebar and view state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('overview');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const apiKey = session?.apiKey || 'demo-key-123';

  const fetchAll = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      // First check if backend is running
      await axios.get('/api/health');

      let custRes, prodRes, orderRes;

      if (session.isAdmin) {
        // Admin view - fetch data for current store
        const currentStore = session.stores.find(s => s.id === session.currentStoreId);
        if (!currentStore) {
          throw new Error('No store selected');
        }

        [custRes, prodRes, orderRes] = await Promise.all([
          axios.get(`/api/customers`, { params: { apiKey: currentStore.apiKey } }),
          axios.get(`/api/products`, { params: { apiKey: currentStore.apiKey } }),
          axios.get(`/api/orders`, { params: { apiKey: currentStore.apiKey } }),
        ]);
      } else {
        // Regular user view
        [custRes, prodRes, orderRes] = await Promise.all([
          axios.get(`/api/customers`, { params: { apiKey: session.apiKey } }),
          axios.get(`/api/products`, { params: { apiKey: session.apiKey } }),
          axios.get(`/api/orders`, { params: { apiKey: session.apiKey } }),
        ]);
      }

      if (!custRes.data || !prodRes.data || !orderRes.data) {
        throw new Error('Invalid data received from backend');
      }

      setCustomers(Array.isArray(custRes.data) ? custRes.data : []);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      setOrders(Array.isArray(orderRes.data) ? orderRes.data : []);
    } catch (err) {
      console.error(err);
      if (err.message === 'Network Error') {
        setError('Unable to connect to backend server. Please ensure it is running.');
      } else if (err.response?.status === 404) {
        setError('Backend API endpoint not found. Please check server configuration.');
      } else {
        setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => { if (session) fetchAll(); }, [session, fetchAll]);

  // ingestion
  // CSV Export functions
  const exportData = {
    orders: () => {
      const rows = [
        ['Order ID', 'Order Number', 'Customer Name', 'Customer Email', 'Total', 'Status', 'Created At', 'Products']
      ];

      for (const order of orders) {
        rows.push([
          order.shopifyId || '',
          order.orderNumber || '',
          order.customer?.name || '',
          order.customer?.email || '',
          order.total || 0,
          order.financialStatus || '',
          order.createdAt || '',
          (order.products || []).map(p => p.title).join('; ')
        ]);
      }

      return rows;
    },

    customers: () => {
      const rows = [
        ['Customer ID', 'Name', 'Email', 'Total Orders', 'Total Spent', 'First Order', 'Last Order']
      ];

      const customerStats = {};
      for (const order of orders) {
        const cid = order.customer?.id;
        if (!cid) continue;

        customerStats[cid] = customerStats[cid] || {
          id: order.customer.id,
          name: order.customer.name,
          email: order.customer.email,
          orders: 0,
          spent: 0,
          firstOrder: order.createdAt,
          lastOrder: order.createdAt
        };

        customerStats[cid].orders++;
        customerStats[cid].spent += order.total || 0;
        customerStats[cid].firstOrder = order.createdAt < customerStats[cid].firstOrder ? order.createdAt : customerStats[cid].firstOrder;
        customerStats[cid].lastOrder = order.createdAt > customerStats[cid].lastOrder ? order.createdAt : customerStats[cid].lastOrder;
      }

      for (const stat of Object.values(customerStats)) {
        rows.push([
          stat.id,
          stat.name,
          stat.email,
          stat.orders,
          stat.spent,
          stat.firstOrder,
          stat.lastOrder
        ]);
      }

      return rows;
    },

    products: () => {
      const rows = [
        ['Product ID', 'Title', 'SKU', 'Price', 'Units Sold', 'Total Revenue', 'First Sale', 'Last Sale']
      ];

      const productStats = {};
      for (const order of orders) {
        for (const product of (order.products || [])) {
          productStats[product.id] = productStats[product.id] || {
            id: product.id,
            title: product.title,
            sku: product.sku,
            price: product.price,
            units: 0,
            revenue: 0,
            firstSale: order.createdAt,
            lastSale: order.createdAt
          };

          productStats[product.id].units++;
          productStats[product.id].revenue += order.total / (order.products.length || 1);
          productStats[product.id].firstSale = order.createdAt < productStats[product.id].firstSale ? order.createdAt : productStats[product.id].firstSale;
          productStats[product.id].lastSale = order.createdAt > productStats[product.id].lastSale ? order.createdAt : productStats[product.id].lastSale;
        }
      }

      for (const stat of Object.values(productStats)) {
        rows.push([
          stat.id,
          stat.title,
          stat.sku || '',
          stat.price || 0,
          stat.units,
          stat.revenue,
          stat.firstSale,
          stat.lastSale
        ]);
      }

      return rows;
    }
  };

  const downloadCSV = (rows, filename) => {
    const csv = rows.map(row =>
      row.map(cell =>
        typeof cell === 'string' && cell.includes(',')
          ? `"${cell}"`
          : cell
      ).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleIngest = async () => {
    if (!apiKey) return;
    setIngesting(true);
    try {
      await axios.post(`/api/ingest`, null, { params: { apiKey } });
      await fetchAll();

      // After successful ingestion, download all data as CSV files
      downloadCSV(exportData.orders(), `orders_${new Date().toISOString().slice(0, 10)}.csv`);
      downloadCSV(exportData.customers(), `customers_${new Date().toISOString().slice(0, 10)}.csv`);
      downloadCSV(exportData.products(), `products_${new Date().toISOString().slice(0, 10)}.csv`);

    } catch (err) {
      console.error(err);
      setError('Ingestion failed. See server logs.');
    } finally {
      setIngesting(false);
    }
  };

  // Fetch insights data
  const [insights, setInsights] = useState(null);
  const [customEvents, setCustomEvents] = useState([]);

  const fetchInsights = useCallback(async () => {
    if (!apiKey) return;
    try {
      const [insightsRes, eventsRes] = await Promise.all([
        axios.get(`/api/insights`, { params: { apiKey, from: fromDate, to: toDate } }),
        axios.get(`/api/events`, { params: { apiKey, from: fromDate, to: toDate } }),
      ]);
      setInsights(insightsRes.data);
      setCustomEvents(eventsRes.data);
    } catch (err) {
      console.error('Error fetching insights:', err);
    }
  }, [apiKey, fromDate, toDate]);

  useEffect(() => {
    if (session) {
      fetchAll();
      fetchInsights();
    }
  }, [session, fetchAll, fetchInsights]);

  // Local calculations (always computed)
  const localTotalRevenue = useMemo(() => orders.reduce((s, o) => s + (o.total || 0), 0), [orders]);
  const localAverageOrderValue = useMemo(() => (orders.length ? localTotalRevenue / orders.length : 0), [localTotalRevenue, orders.length]);
  const localRepeatCustomers = useMemo(() => {
    const map = {};
    for (const o of orders) {
      const cid = o.customer?.id || o.customerId;
      if (!cid) continue;
      map[cid] = (map[cid] || 0) + 1;
    }
    return Object.values(map).filter(v => v > 1).length;
  }, [orders]);

  const localTopProducts = useMemo(() => {
    const map = {};
    for (const o of orders) {
      const items = o.products || [];
      for (const p of items) {
        const id = p.id || p.shopifyId || p.title;
        if (!id) continue;
        map[id] = map[id] || { id, title: p.title || p.name || id, units: 0, revenue: 0, price: p.price || 0 };
        map[id].units += 1;
        map[id].revenue += (o.total && items.length ? (o.total / items.length) : (p.price || 0));
      }
    }
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [orders]);

  const localTopCustomers = useMemo(() => {
    const spend = {};
    for (const o of orders) {
      const cid = o.customer?.id || o.customerId || 'unknown';
      const name = o.customer?.name || o.customer?.email || `Customer ${cid}`;
      spend[cid] = spend[cid] || { name, total: 0 };
      spend[cid].total += (o.total || 0);
    }
    return Object.values(spend).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [orders]);

  // date-range filter for orders
  const filteredOrders = useMemo(() => {
    if (!fromDate && !toDate) return orders;
    const from = fromDate ? new Date(fromDate) : new Date('1970-01-01');
    const to = toDate ? new Date(toDate) : new Date();
    to.setHours(23, 59, 59, 999);
    return orders.filter(o => {
      const d = new Date(o.createdAt || o.orderDate || o.date || null);
      if (!d || isNaN(d)) return false;
      return d >= from && d <= to;
    });
  }, [orders, fromDate, toDate]);

  const localOrdersByDateSeries = useMemo(() => {
    const map = {};
    for (const o of filteredOrders) {
      const d = new Date(o.createdAt || o.orderDate || o.date || null);
      if (!d || isNaN(d)) continue;
      const key = d.toISOString().slice(0, 10);
      map[key] = (map[key] || 0) + (o.total || 0);
    }
    return Object.entries(map).map(([date, total]) => ({ date, total })).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredOrders]);

  // Use insights data or fallback to local calculations
  const totalRevenue = insights?.totalRevenue || localTotalRevenue;
  const totalCustomers = insights?.totalCustomers || customers.length;
  const totalOrders = insights?.totalOrders || orders.length;
  const totalProducts = insights?.totalProducts || products.length;
  const averageOrderValue = insights?.averageOrderValue || localAverageOrderValue;
  const repeatCustomers = insights?.repeatCustomers || localRepeatCustomers;
  const revenueGrowth = insights?.revenueGrowth || 0;
  const topProducts = insights?.topProducts || localTopProducts;
  const topCustomers = insights?.topCustomers || localTopCustomers;
  const ordersByDateSeries = insights?.ordersByDate || localOrdersByDateSeries;

  // login actions
  const handleLoginSave = async ({ email, apiKey }) => {
    const isAdmin = email === 'admin@example.com';

    if (isAdmin) {
      // For admin, fetch all stores data
      try {
        const storesRes = await axios.get('/api/stores');
        const stores = storesRes.data;

        // Store all data with admin flag
        const s = {
          email,
          apiKey: 'admin',
          isAdmin: true,
          stores: stores.map(store => ({
            id: store.id,
            name: store.name,
            apiKey: store.apiKey
          })),
          currentStoreId: stores[0]?.id
        };
        localStorage.setItem('session', JSON.stringify(s));
        setSession(s);
        setShowLogin(false);
      } catch (err) {
        console.error('Failed to fetch stores:', err);
        setError('Failed to fetch store data. Please try again.');
        return;
      }
    } else {
      // Regular user flow
      const s = { email, apiKey, isAdmin: false };
      localStorage.setItem('session', JSON.stringify(s));
      setSession(s);
      setShowLogin(false);
    }

    setTimeout(fetchAll, 150); // small delay to ensure session applied
  };
  const handleLogout = () => { localStorage.removeItem('session'); setSession(null); setShowLogin(true); };

  // Analytics view component
  const AnalyticsView = () => {
    const [timeframe, setTimeframe] = useState('30d'); // 7d, 30d, 90d, 1y
    const [metric, setMetric] = useState('revenue'); // revenue, orders, customers

    // Calculate date range based on timeframe
    const dateRange = useMemo(() => {
      const end = new Date();
      const start = new Date();
      switch (timeframe) {
        case '7d':
          start.setDate(end.getDate() - 7);
          break;
        case '90d':
          start.setDate(end.getDate() - 90);
          break;
        case '1y':
          start.setFullYear(end.getFullYear() - 1);
          break;
        default: // 30d
          start.setDate(end.getDate() - 30);
      }
      return { start, end };
    }, [timeframe]);

    // Calculate metrics over time
    const timeSeriesData = useMemo(() => {
      const data = {};
      const { start, end } = dateRange;

      // Initialize all dates in range
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        data[key] = { date: key, revenue: 0, orders: 0, customers: new Set() };
      }

      // Aggregate order data
      for (const order of orders) {
        const date = new Date(order.createdAt);
        if (date >= start && date <= end) {
          const key = date.toISOString().slice(0, 10);
          if (data[key]) {
            data[key].revenue += order.total || 0;
            data[key].orders += 1;
            data[key].customers.add(order.customerId);
          }
        }
      }

      // Convert to array and finalize customer counts
      return Object.values(data).map(d => ({
        ...d,
        customers: d.customers.size
      }));
    }, [orders, dateRange]);

    // Calculate key metrics
    const metrics = useMemo(() => {
      const { start, end } = dateRange;
      const periodOrders = orders.filter(o => {
        const date = new Date(o.createdAt);
        return date >= start && date <= end;
      });

      const prevStart = new Date(start);
      const prevEnd = new Date(end);
      const diff = end.getTime() - start.getTime();
      prevStart.setTime(start.getTime() - diff);
      prevEnd.setTime(end.getTime() - diff);

      const prevPeriodOrders = orders.filter(o => {
        const date = new Date(o.createdAt);
        return date >= prevStart && date <= prevEnd;
      });

      const uniqueCustomers = new Set(periodOrders.map(o => o.customerId));
      const prevUniqueCustomers = new Set(prevPeriodOrders.map(o => o.customerId));

      const revenue = periodOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const prevRevenue = prevPeriodOrders.reduce((sum, o) => sum + (o.total || 0), 0);

      return {
        revenue: {
          current: revenue,
          previous: prevRevenue,
          change: ((revenue - prevRevenue) / (prevRevenue || 1)) * 100
        },
        orders: {
          current: periodOrders.length,
          previous: prevPeriodOrders.length,
          change: ((periodOrders.length - prevPeriodOrders.length) / (prevPeriodOrders.length || 1)) * 100
        },
        customers: {
          current: uniqueCustomers.size,
          previous: prevUniqueCustomers.size,
          change: ((uniqueCustomers.size - prevUniqueCustomers.size) / (prevUniqueCustomers.size || 1)) * 100
        },
        aov: {
          current: revenue / (periodOrders.length || 1),
          previous: prevRevenue / (prevPeriodOrders.length || 1),
          change: ((revenue / (periodOrders.length || 1) - prevRevenue / (prevPeriodOrders.length || 1)) / (prevRevenue / (prevPeriodOrders.length || 1) || 1)) * 100
        }
      };
    }, [orders, dateRange]);

    return (
      <Box>
        {/* Time period selector */}
        <Card sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          mb: 3,
          p: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLORS.dark }}>
              📊 Analytics Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { label: '7 Days', value: '7d' },
                { label: '30 Days', value: '30d' },
                { label: '90 Days', value: '90d' },
                { label: '1 Year', value: '1y' }
              ].map((period) => (
                <Chip
                  key={period.value}
                  label={period.label}
                  onClick={() => setTimeframe(period.value)}
                  color={timeframe === period.value ? 'primary' : 'default'}
                  variant={timeframe === period.value ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>
        </Card>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[
            {
              label: 'Revenue',
              value: metrics.revenue.current,
              change: metrics.revenue.change,
              format: formatCurrency
            },
            {
              label: 'Orders',
              value: metrics.orders.current,
              change: metrics.orders.change,
              format: (v) => Math.round(v)
            },
            {
              label: 'Customers',
              value: metrics.customers.current,
              change: metrics.customers.change,
              format: (v) => Math.round(v)
            },
            {
              label: 'Average Order Value',
              value: metrics.aov.current,
              change: metrics.aov.change,
              format: formatCurrency
            }
          ].map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.label}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                p: 3
              }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.gray, mb: 1 }}>
                  {metric.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {metric.format(metric.value)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`${metric.change >= 0 ? '+' : ''}${metric.change.toFixed(1)}%`}
                    color={metric.change >= 0 ? 'success' : 'error'}
                    size="small"
                  />
                  <Typography variant="caption" sx={{ color: COLORS.gray }}>
                    vs previous period
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              p: 3
            }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: COLORS.dark }}>
                Trends Over Time
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {[
                  { label: 'Revenue', value: 'revenue' },
                  { label: 'Orders', value: 'orders' },
                  { label: 'Customers', value: 'customers' }
                ].map((m) => (
                  <Chip
                    key={m.value}
                    label={m.label}
                    onClick={() => setMetric(m.value)}
                    color={metric === m.value ? 'primary' : 'default'}
                    variant={metric === m.value ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        metric === 'revenue'
                          ? formatCurrency(value).replace('₹', '')
                          : value
                      }
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip
                      formatter={(value) => [
                        metric === 'revenue'
                          ? formatCurrency(value)
                          : value,
                        metric.charAt(0).toUpperCase() + metric.slice(1)
                      ]}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Area
                      type="monotone"
                      dataKey={metric}
                      stroke={COLORS.primary}
                      fillOpacity={1}
                      fill="url(#colorMetric)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              p: 3
            }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: COLORS.dark }}>
                Sales Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topProducts.slice(0, 5)}
                      dataKey="revenue"
                      nameKey="title"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {topProducts.slice(0, 5).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2 }}>
                {topProducts.slice(0, 5).map((product, index) => (
                  <Box
                    key={product.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: GRADIENT_COLORS[index % GRADIENT_COLORS.length]
                        }}
                      />
                      <Typography variant="caption">
                        {product.title}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(product.revenue)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Admin Overview Component
  const OverviewAdmin = () => {
    const [allStoresData, setAllStoresData] = useState(null);

    useEffect(() => {
      const fetchAllStoresData = async () => {
        if (!session?.isAdmin) return;

        try {
          const storeData = await Promise.all(
            session.stores.map(async (store) => {
              const [custRes, prodRes, orderRes] = await Promise.all([
                axios.get(`/api/customers`, { params: { apiKey: store.apiKey } }),
                axios.get(`/api/products`, { params: { apiKey: store.apiKey } }),
                axios.get(`/api/orders`, { params: { apiKey: store.apiKey } }),
              ]);

              return {
                store: store.name,
                customers: custRes.data,
                products: prodRes.data,
                orders: orderRes.data,
              };
            })
          );

          setAllStoresData(storeData);
        } catch (err) {
          console.error('Failed to fetch all stores data:', err);
          setError('Failed to fetch aggregate store data');
        }
      };

      fetchAllStoresData();
    }, [session]);

    // Calculate aggregate metrics
    const aggregateMetrics = useMemo(() => {
      if (!allStoresData) return null;

      return {
        totalRevenue: allStoresData.reduce((sum, store) =>
          sum + store.orders.reduce((s, o) => s + (o.total || 0), 0), 0),
        totalOrders: allStoresData.reduce((sum, store) =>
          sum + store.orders.length, 0),
        totalCustomers: allStoresData.reduce((sum, store) =>
          sum + store.customers.length, 0),
        totalProducts: allStoresData.reduce((sum, store) =>
          sum + store.products.length, 0),
        storeMetrics: allStoresData.map(store => ({
          name: store.store,
          revenue: store.orders.reduce((s, o) => s + (o.total || 0), 0),
          orders: store.orders.length,
          customers: store.customers.length,
          products: store.products.length
        }))
      };
    }, [allStoresData]);

    if (!aggregateMetrics) {
      return (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 3, px: 3, pb: 3 }}>
        {/* Aggregate KPIs */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[
            {
              label: 'Total Revenue',
              value: formatCurrency(aggregateMetrics.totalRevenue),
              icon: <MoneyIcon />
            },
            {
              label: 'Total Orders',
              value: aggregateMetrics.totalOrders,
              icon: <ShoppingCartIcon />
            },
            {
              label: 'Total Customers',
              value: aggregateMetrics.totalCustomers,
              icon: <PeopleIcon />
            },
            {
              label: 'Total Products',
              value: aggregateMetrics.totalProducts,
              icon: <InventoryIcon />
            }
          ].map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.label}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                p: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: COLORS.primary, mr: 2 }}>
                    {metric.icon}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {metric.label}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {metric.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Store Comparison Chart */}
        <Card sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          p: 3,
          mb: 3
        }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: COLORS.dark }}>
            Store Performance Comparison
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={aggregateMetrics.storeMetrics}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke={COLORS.primary}>
                  <Label
                    value="Revenue"
                    position="insideLeft"
                    angle={-90}
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <YAxis yAxisId="right" orientation="right" stroke={COLORS.info}>
                  <Label
                    value="Orders"
                    position="insideRight"
                    angle={90}
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]} />
                <Bar yAxisId="left" dataKey="revenue" fill={COLORS.primary} name="revenue" />
                <Bar yAxisId="right" dataKey="orders" fill={COLORS.info} name="orders" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Store Details Table */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${COLORS.light}` }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLORS.dark }}>
              Store Details
            </Typography>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: COLORS.light }}>
                  <th style={{ padding: 16, textAlign: 'left' }}>Store</th>
                  <th style={{ padding: 16, textAlign: 'right' }}>Revenue</th>
                  <th style={{ padding: 16, textAlign: 'right' }}>Orders</th>
                  <th style={{ padding: 16, textAlign: 'right' }}>Customers</th>
                  <th style={{ padding: 16, textAlign: 'right' }}>Products</th>
                </tr>
              </thead>
              <tbody>
                {aggregateMetrics.storeMetrics.map((store, index) => (
                  <tr key={store.name} style={{
                    backgroundColor: index % 2 === 0 ? 'white' : COLORS.light
                  }}>
                    <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}` }}>
                      {store.name}
                    </td>
                    <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                      {formatCurrency(store.revenue)}
                    </td>
                    <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                      {store.orders}
                    </td>
                    <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                      {store.customers}
                    </td>
                    <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                      {store.products}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Card>
      </Box>
    );
  };

  const OrdersView = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchText, setSearchText] = useState('');

    const filteredAndSortedOrders = useMemo(() => {
      return orders
        .filter(order => {
          if (!searchText) return true;
          const searchLower = searchText.toLowerCase();
          return (
            order.orderNumber?.toLowerCase().includes(searchLower) ||
            order.customer?.name?.toLowerCase().includes(searchLower) ||
            order.customer?.email?.toLowerCase().includes(searchLower)
          );
        })
        .sort((a, b) => {
          const aValue = sortBy === 'customer.name' ? a.customer?.name : a[sortBy];
          const bValue = sortBy === 'customer.name' ? b.customer?.name : b[sortBy];
          const modifier = sortDir === 'asc' ? 1 : -1;
          if (typeof aValue === 'number') {
            return (aValue - bValue) * modifier;
          }
          if (sortBy === 'createdAt') {
            return (new Date(aValue) - new Date(bValue)) * modifier;
          }
          return String(aValue).localeCompare(String(bValue)) * modifier;
        });
    }, [orders, searchText, sortBy, sortDir]);

    const handleSort = (field) => {
      if (sortBy === field) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortDir('desc');
      }
    };

    return (
      <Box>
        <Card sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          mb: 3
        }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${COLORS.light}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLORS.dark }}>
                📦 Orders
              </Typography>
              <TextField
                placeholder="Search orders..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                sx={{
                  width: 300,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[
                { label: 'All', value: '' },
                { label: 'Paid', value: 'paid' },
                { label: 'Pending', value: 'pending' },
                { label: 'Fulfilled', value: 'fulfilled' }
              ].map((status) => (
                <Chip
                  key={status.value}
                  label={status.label}
                  onClick={() => setSearchText(status.value)}
                  color={searchText === status.value ? 'primary' : 'default'}
                  variant={searchText === status.value ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: 1000
            }}>
              <thead>
                <tr style={{ backgroundColor: COLORS.light }}>
                  <th style={{ padding: 16, textAlign: 'left', cursor: 'pointer' }}>
                    Order #
                  </th>
                  <th style={{ padding: 16, textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('customer.name')}>
                    Customer {sortBy === 'customer.name' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: 16, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('total')}>
                    Total {sortBy === 'total' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: 16, textAlign: 'center' }}>
                    Status
                  </th>
                  <th style={{ padding: 16, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                    Date {sortBy === 'createdAt' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: 16, textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedOrders.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((order) => (
                  <React.Fragment key={order.id}>
                    <tr style={{
                      backgroundColor: 'white',
                    }}>
                      <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}` }}>
                        #{order.orderNumber || order.shopifyId}
                      </td>
                      <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}` }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {order.customer?.name || 'Unknown'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: COLORS.gray }}>
                            {order.customer?.email}
                          </Typography>
                        </Box>
                      </td>
                      <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                        {formatCurrency(order.total)}
                      </td>
                      <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'center' }}>
                        <Chip
                          label={order.financialStatus || 'unknown'}
                          color={
                            order.financialStatus === 'paid' ? 'success' :
                              order.financialStatus === 'pending' ? 'warning' :
                                'default'
                          }
                          size="small"
                        />
                      </td>
                      <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                        <IconButton
                          size="small"
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        >
                          {expandedOrder === order.id ? '↑' : '↓'}
                        </IconButton>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={6} style={{ padding: 0 }}>
                          <Box sx={{ p: 3, bgcolor: COLORS.light }}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                  Order Details
                                </Typography>
                                <Stack spacing={1}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ color: COLORS.gray }}>Subtotal:</Typography>
                                    <Typography variant="body2">{formatCurrency(order.subtotal)}</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ color: COLORS.gray }}>Tax:</Typography>
                                    <Typography variant="body2">{formatCurrency(order.totalTax)}</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ color: COLORS.gray }}>Shipping:</Typography>
                                    <Typography variant="body2">{formatCurrency(order.shippingCost)}</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ color: COLORS.gray }}>Discounts:</Typography>
                                    <Typography variant="body2">-{formatCurrency(order.totalDiscounts)}</Typography>
                                  </Box>
                                  <Divider />
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{formatCurrency(order.total)}</Typography>
                                  </Box>
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                  Products
                                </Typography>
                                <Stack spacing={2}>
                                  {(order.products || []).map((product) => (
                                    <Box key={product.id} sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      p: 2,
                                      borderRadius: 2,
                                      bgcolor: 'white'
                                    }}>
                                      {product.imageUrl ? (
                                        <Avatar
                                          src={product.imageUrl}
                                          variant="rounded"
                                          sx={{ width: 40, height: 40, mr: 2 }}
                                        />
                                      ) : (
                                        <Avatar
                                          variant="rounded"
                                          sx={{
                                            width: 40,
                                            height: 40,
                                            mr: 2,
                                            bgcolor: COLORS.primary
                                          }}
                                        >
                                          {product.title.charAt(0)}
                                        </Avatar>
                                      )}
                                      <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                          {product.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: COLORS.gray }}>
                                          SKU: {product.sku || 'N/A'}
                                        </Typography>
                                      </Box>
                                      <Typography variant="body2">
                                        {formatCurrency(product.price)}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Stack>
                              </Grid>
                            </Grid>
                          </Box>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </Box>
          <Box sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 2,
            borderTop: `1px solid ${COLORS.light}`
          }}>
            <Typography variant="body2" sx={{ color: COLORS.gray }}>
              Rows per page:
            </Typography>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              style={{
                padding: '4px 8px',
                border: `1px solid ${COLORS.light}`,
                borderRadius: 4,
                backgroundColor: 'white'
              }}
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <Typography variant="body2" sx={{ color: COLORS.gray }}>
              {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredAndSortedOrders.length)} of {filteredAndSortedOrders.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                size="small"
              >
                ←
              </IconButton>
              <IconButton
                onClick={() => setPage(p => Math.min(Math.ceil(filteredAndSortedOrders.length / rowsPerPage) - 1, p + 1))}
                disabled={page >= Math.ceil(filteredAndSortedOrders.length / rowsPerPage) - 1}
                size="small"
              >
                →
              </IconButton>
            </Box>
          </Box>
        </Card>
      </Box>
    );
  };

  // Products view component
  const ProductsView = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('revenue');
    const [sortDir, setSortDir] = useState('desc');

    // Calculate product sales data
    const productSalesData = useMemo(() => {
      const salesData = {};

      // Initialize with product info
      for (const product of products) {
        salesData[product.id] = {
          ...product,
          revenue: 0,
          unitsSold: 0,
          lastSold: null,
          customers: new Set(),
          orders: []
        };
      }

      // Add sales data from orders
      for (const order of orders) {
        for (const product of (order.products || [])) {
          const productData = salesData[product.id];
          if (productData) {
            productData.revenue += order.total / (order.products.length || 1);
            productData.unitsSold += 1;
            productData.customers.add(order.customerId);
            productData.lastSold = order.createdAt;
            productData.orders.push({
              orderId: order.id,
              customerName: order.customer?.name || 'Unknown',
              date: order.createdAt,
              total: order.total / (order.products.length || 1)
            });
          }
        }
      }

      // Convert to array and calculate final metrics
      return Object.values(salesData).map(p => ({
        ...p,
        customers: p.customers.size,
        averageOrderValue: p.revenue / (p.unitsSold || 1),
        lastSold: p.lastSold || '-'
      }));
    }, [products, orders]);

    const sortedProducts = useMemo(() => {
      return [...productSalesData].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        const modifier = sortDir === 'asc' ? 1 : -1;
        if (typeof aValue === 'number') {
          return (aValue - bValue) * modifier;
        }
        return String(aValue).localeCompare(String(bValue)) * modifier;
      });
    }, [productSalesData, sortBy, sortDir]);

    const handleSort = (field) => {
      if (sortBy === field) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortDir('desc');
      }
    };

    return (
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: `1px solid ${COLORS.light}` }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLORS.dark }}>
            🛍️ Product Sales
          </Typography>
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 1000
          }}>
            <thead>
              <tr style={{ backgroundColor: COLORS.light }}>
                <th style={{ padding: 16, textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('title')}>
                  Product {sortBy === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: 16, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('price')}>
                  Price {sortBy === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: 16, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('revenue')}>
                  Revenue {sortBy === 'revenue' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: 16, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('unitsSold')}>
                  Units Sold {sortBy === 'unitsSold' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: 16, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('customers')}>
                  Customers {sortBy === 'customers' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: 16, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('averageOrderValue')}>
                  AOV {sortBy === 'averageOrderValue' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ padding: 16, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('lastSold')}>
                  Last Sold {sortBy === 'lastSold' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((product, index) => (
                <tr key={product.id} style={{
                  backgroundColor: index % 2 === 0 ? 'white' : COLORS.light
                }}>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {product.imageUrl ? (
                        <Avatar
                          src={product.imageUrl}
                          variant="rounded"
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            background: GRADIENT_COLORS[index % GRADIENT_COLORS.length]
                          }}
                        >
                          {product.title.charAt(0)}
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {product.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: COLORS.gray }}>
                          SKU: {product.sku || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </td>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                    {formatCurrency(product.price)}
                  </td>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                    {formatCurrency(product.revenue)}
                  </td>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                    {product.unitsSold}
                  </td>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                    {product.customers}
                  </td>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                    {formatCurrency(product.averageOrderValue)}
                  </td>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                    {product.lastSold ? new Date(product.lastSold).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        <Box sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 2,
          borderTop: `1px solid ${COLORS.light}`
        }}>
          <Typography variant="body2" sx={{ color: COLORS.gray }}>
            Rows per page:
          </Typography>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              border: `1px solid ${COLORS.light}`,
              borderRadius: 4,
              backgroundColor: 'white'
            }}
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <Typography variant="body2" sx={{ color: COLORS.gray }}>
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, sortedProducts.length)} of {sortedProducts.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              size="small"
            >
              ←
            </IconButton>
            <IconButton
              onClick={() => setPage(p => Math.min(Math.ceil(sortedProducts.length / rowsPerPage) - 1, p + 1))}
              disabled={page >= Math.ceil(sortedProducts.length / rowsPerPage) - 1}
              size="small"
            >
              →
            </IconButton>
          </Box>
        </Box>
      </Card>
    );
  };

  // Customers view component
  const CustomersView = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('totalSpent');
    const [sortDir, setSortDir] = useState('desc');

    const sortedCustomers = useMemo(() => {
      return [...customers].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        const modifier = sortDir === 'asc' ? 1 : -1;
        if (sortBy === 'totalSpent' || sortBy === 'ordersCount') {
          return (aValue - bValue) * modifier;
        }
        return String(aValue).localeCompare(String(bValue)) * modifier;
      });
    }, [customers, sortBy, sortDir]);

    const handleSort = (field) => {
      if (sortBy === field) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortDir('desc');
      }
    };

    return (
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: `1px solid ${COLORS.light}` }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLORS.dark }}>
            🙋 Customer Details
          </Typography>
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 800
          }}>
            <thead>
              <tr style={{ backgroundColor: COLORS.light }}>
                <th style={{
                  padding: 16,
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${COLORS.light}`,
                  color: COLORS.dark
                }} onClick={() => handleSort('name')}>
                  Customer Name {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{
                  padding: 16,
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${COLORS.light}`,
                  color: COLORS.dark
                }} onClick={() => handleSort('email')}>
                  Email {sortBy === 'email' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{
                  padding: 16,
                  textAlign: 'right',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${COLORS.light}`,
                  color: COLORS.dark
                }} onClick={() => handleSort('totalSpent')}>
                  Total Spent {sortBy === 'totalSpent' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{
                  padding: 16,
                  textAlign: 'right',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${COLORS.light}`,
                  color: COLORS.dark
                }} onClick={() => handleSort('ordersCount')}>
                  Orders {sortBy === 'ordersCount' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{
                  padding: 16,
                  textAlign: 'center',
                  borderBottom: `1px solid ${COLORS.light}`,
                  color: COLORS.dark
                }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((customer, index) => (
                <tr key={customer.id} style={{
                  backgroundColor: index % 2 === 0 ? 'white' : COLORS.light
                }}>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{
                        background: GRADIENT_COLORS[index % GRADIENT_COLORS.length],
                        mr: 2,
                        width: 32,
                        height: 32
                      }}>
                        {customer.name?.charAt(0)}
                      </Avatar>
                      {customer.name}
                    </Box>
                  </td>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}` }}>
                    {customer.email}
                  </td>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'right' }}>
                    {customer.ordersCount}
                  </td>
                  <td style={{ padding: 16, borderBottom: `1px solid ${COLORS.light}`, textAlign: 'center' }}>
                    <Chip
                      label={customer.state || 'active'}
                      color={customer.state === 'disabled' ? 'default' : 'success'}
                      size="small"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        <Box sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 2,
          borderTop: `1px solid ${COLORS.light}`
        }}>
          <Typography variant="body2" sx={{ color: COLORS.gray }}>
            Rows per page:
          </Typography>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              border: `1px solid ${COLORS.light}`,
              borderRadius: 4,
              backgroundColor: 'white'
            }}
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <Typography variant="body2" sx={{ color: COLORS.gray }}>
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, customers.length)} of {customers.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              size="small"
            >
              ←
            </IconButton>
            <IconButton
              onClick={() => setPage(p => Math.min(Math.ceil(customers.length / rowsPerPage) - 1, p + 1))}
              disabled={page >= Math.ceil(customers.length / rowsPerPage) - 1}
              size="small"
            >
              →
            </IconButton>
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: COLORS.light }}>
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} onSave={handleLoginSave} />

      {/* Error Alert */}
      {error && (
        <Box sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          maxWidth: '80%'
        }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              bgcolor: COLORS.danger,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Error
              </Typography>
              <Typography variant="body2">
                {error}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setError(null)}
              sx={{ color: 'white' }}
            >
              <VisibilityIcon />
            </IconButton>
          </Paper>
        </Box>
      )}

      {/* AdminLTE Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      {/* Main Content Area */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        ml: isMobile ? 0 : sidebarOpen ? '250px' : 0, 
        transition: 'margin 0.3s ease'
      }}>
        {/* AdminLTE Header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: 'white',
            borderBottom: `1px solid ${COLORS.light}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{ mr: 2, color: COLORS.dark }}
              >
                <MenuIcon />
              </IconButton>
              {session?.isAdmin ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: COLORS.dark }}>
                    Admin Dashboard
                  </Typography>
                  <Select
                    value={session.currentStoreId || ''}
                    onChange={(e) => {
                      const newSession = {
                        ...session,
                        currentStoreId: e.target.value
                      };
                      setSession(newSession);
                      localStorage.setItem('session', JSON.stringify(newSession));
                    }}
                    size="small"
                    sx={{ minWidth: 200 }}
                  >
                    {session.stores.map((store) => (
                      <MenuItem key={store.id} value={store.id}>
                        {store.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    color: COLORS.dark,
                    background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.info})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Shopify Insights Dashboard
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.gray }}>
                    Multi-tenant analytics platform
                    {session?.apiKey &&(
                      <>
                      <br />
                      store: {session.apiKey}
                      </>
                    )}
                    
                  </Typography>                
                </Box>
              )}
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              {session ? (
                <>
                  <Chip
                    icon={<PersonIcon />}
                    label={session.email}
                    variant="outlined"
                    sx={{ borderColor: COLORS.primary, color: COLORS.primary }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => fetchAll()}
                    sx={{ borderColor: COLORS.success, color: COLORS.success }}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<TrendingUpIcon />}
                    onClick={handleIngest}
                    disabled={ingesting}
                    sx={{
                      background: `linear-gradient(45deg, ${COLORS.warning}, ${COLORS.orange})`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${COLORS.orange}, ${COLORS.warning})`,
                      }
                    }}
                  >
                    {ingesting ? 'Ingesting...' : 'Ingest Data'}
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setShowLogin(true)}
                  sx={{
                    background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.info})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${COLORS.info}, ${COLORS.primary})`,
                    }
                  }}
                >
                  Sign In
                </Button>
              )}
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: COLORS.light }}>
          {/* AdminLTE KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Slide direction="up" in={true} timeout={300}>
                <Card sx={{
                  background: GRADIENT_COLORS[0],
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                        <PeopleIcon />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ opacity: 0.9, fontWeight: 'bold' }}>
                        Total Customers
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {loading ? '...' : totalCustomers.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      Active customers
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Slide direction="up" in={true} timeout={400}>
                <Card sx={{
                  background: GRADIENT_COLORS[1],
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                        <ShoppingCartIcon />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ opacity: 0.9, fontWeight: 'bold' }}>
                        Total Orders
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {loading ? '...' : totalOrders.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      Orders placed
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Slide direction="up" in={true} timeout={500}>
                <Card sx={{
                  background: GRADIENT_COLORS[2],
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                        <MoneyIcon />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ opacity: 0.9, fontWeight: 'bold' }}>
                        Revenue
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {loading ? '...' : formatCurrency(totalRevenue)}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      {revenueGrowth >= 0 ? '▲' : '▼'} {Math.abs(revenueGrowth).toFixed(1)}% growth
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Slide direction="up" in={true} timeout={600}>
                <Card sx={{
                  background: GRADIENT_COLORS[3],
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                        <ShoppingBagIcon />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ opacity: 0.9, fontWeight: 'bold' }}>
                        Avg Order Value
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {loading ? '...' : formatCurrency(averageOrderValue)}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      Per order
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Slide direction="up" in={true} timeout={700}>
                <Card sx={{
                  background: GRADIENT_COLORS[4],
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                        <StarIcon />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ opacity: 0.9, fontWeight: 'bold' }}>
                        Repeat Customers
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {loading ? '...' : repeatCustomers}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      Loyal customers
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          </Grid>

          {/* View-based Content */}
          {currentView === 'customers' ? (
            <Fade in={currentView === 'customers'} timeout={500}>
              <Box sx={{ mt: 3, px: 3, pb: 3 }}>
                <CustomersView />
              </Box>
            </Fade>
          ) : currentView === 'products' ? (
            <Fade in={currentView === 'products'} timeout={500}>
              <Box sx={{ mt: 3, px: 3, pb: 3 }}>
                <ProductsView />
              </Box>
            </Fade>
          ) : currentView === 'orders' ? (
            <Fade in={currentView === 'orders'} timeout={500}>
              <Box sx={{ mt: 3, px: 3, pb: 3 }}>
                <OrdersView />
              </Box>
            </Fade>
          ) : currentView === 'analytics' ? (
            <Fade in={currentView === 'analytics'} timeout={500}>
              <Box sx={{ mt: 3, px: 3, pb: 3 }}>
                <AnalyticsView />
              </Box>
            </Fade>
          ) : currentView === 'overview' ? (
            session?.isAdmin ? (
              <Fade in={true} timeout={500}>
                <Box>
                  <OverviewAdmin />
                </Box>
              </Fade>
            ) : (
              <Fade in={currentView === 'overview'} timeout={500}>
                <Box>
                  {/* Revenue Chart */}
                  <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: COLORS.dark }}>
                        📈 Revenue Trend
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={ordersByDateSeries}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip
                              formatter={(value) => [formatCurrency(value), 'Revenue']}
                              labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Area
                              type="monotone"
                              dataKey="total"
                              stroke={COLORS.primary}
                              fillOpacity={1}
                              fill="url(#colorRevenue)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                  {/* Top Customers & Products */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: COLORS.dark }}>
                            🏆 Top Customers
                          </Typography>
                          <Stack spacing={2}>
                            {topCustomers.slice(0, 5).map((customer, index) => (
                              <Box key={customer.name} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: index % 2 === 0 ? COLORS.light : 'white', border: `1px solid ${COLORS.light}` }}>
                                <Avatar sx={{ background: GRADIENT_COLORS[index % GRADIENT_COLORS.length], mr: 2, width: 40, height: 40 }}>
                                  {index + 1}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {customer.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: COLORS.gray }}>
                                    {formatCurrency(customer.total)} spent
                                  </Typography>
                                </Box>
                                <Chip
                                  label={formatCurrency(customer.total)}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                />
                              </Box>
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: COLORS.dark }}>
                            🛍️ Top Products
                          </Typography>
                          <Stack spacing={2}>
                            {topProducts.slice(0, 5).map((product, index) => (
                              <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: index % 2 === 0 ? COLORS.light : 'white', border: `1px solid ${COLORS.light}` }}>
                                <Avatar sx={{ background: GRADIENT_COLORS[(index + 3) % GRADIENT_COLORS.length], mr: 2, width: 40, height: 40 }}>
                                  {index + 1}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {product.title}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: COLORS.gray }}>
                                    {product.units} units sold
                                  </Typography>
                                </Box>
                                <Chip
                                  label={formatCurrency(product.revenue)}
                                  color="success"
                                  variant="outlined"
                                  size="small"
                                />
                              </Box>
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )
          ) : (
            // Fallback for any other view (e.g., 'events')
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h4" sx={{ color: COLORS.gray, mb: 2 }}>
                  🚧 {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View
                </Typography>
                <Typography variant="body1" sx={{ color: COLORS.gray }}>
                  This view is coming soon! Stay tuned for more features.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
}

