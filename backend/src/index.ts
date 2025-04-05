import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import inventoryRoutes from './routes/inventory.routes';
import supplierRoutes from './routes/supplier.routes';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', inventoryRoutes);
app.use('/api', supplierRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
