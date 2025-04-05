// src/routes/inventory.routes.ts
import express from 'express';
import {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory
} from '../controllers/inventory.controller';

const router = express.Router();

router.get('/inventory', getInventory);
router.get('/inventory/:id', getInventoryById);
router.post('/inventory', createInventory);
router.put('/inventory/:id', updateInventory);
router.delete('/inventory/:id', deleteInventory);

export default router;
