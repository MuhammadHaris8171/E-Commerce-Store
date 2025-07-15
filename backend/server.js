const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

// Import routes
const roleRoutes = require('./routes/roleRoutes');
const departmentRoutes = require('./routes/departmentsRoute');
const userRoutes = require('./routes/userRoute');
const galleryRoutes = require('./routes/galleryRoutes');
const unitRoutes = require('./routes/unitRoutes');
const ItemCategoryRoutes = require('./routes/ItemCategoryRoute');
const ItemRoutes = require('./routes/itemRoutes');
const RecipeExpertRoutes = require('./routes/recipeExpertRoutes');
const BranchRoutes = require('./routes/branchRoutes');
const BrandRoutes = require('./routes/brandRoute');
const CurrencyRoutes = require('./routes/currencyRoute');
const MenuItemRoutes = require('./routes/MenuItem');
const TaxRoutes = require('./routes/tax');
const SupplierRoutes = require('./routes/supplierRoutes');
const PackageItemRoutes = require('./routes/packageItemRoutes');
const packagingRoutes = require('./routes/packagingRoutes');
const SubCategoryRoutes = require('./routes/subCategoryRoutes');

const app = express();

// Security middleware
app.use(helmet());
const allowedOrigins = [
  'http://localhost:3000',
  'https://gnrcontrol.com',
  'https://www.gnrcontrol.com',
  'https://digital-ocean-olive.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


// General rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Specific rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: { message: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Root route to check API
app.get('/', (req, res) => {
  res.json({ message: "API running successfully", status: "ok" });
});

// API routes
app.use('/api/roles', roleRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/packaging', packagingRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/item-categories', ItemCategoryRoutes);
app.use('/api/items', ItemRoutes); 
app.use('/api/recipe-experts', RecipeExpertRoutes); 
app.use('/api/branch', BranchRoutes); 
app.use('/api/brand', BrandRoutes); 
app.use('/api/currency', CurrencyRoutes);
app.use('/api/menu', MenuItemRoutes) 
app.use('/api/tax', TaxRoutes) 
app.use('/api/suppliers', SupplierRoutes);
app.use('/api/package-items', PackageItemRoutes);
app.use('/api/sub-categories', SubCategoryRoutes);

// Apply login rate limiting to login route
app.use('/api/users/login', loginLimiter);

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
