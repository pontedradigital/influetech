import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import companyRoutes from './routes/company.routes';
import saleRoutes from './routes/sale.routes';
// import shipmentRoutes from './routes/shipment.routes'; // Temporarily disabled

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/sales', saleRoutes);
// app.use('/api/shipments', shipmentRoutes); // Temporarily disabled

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
