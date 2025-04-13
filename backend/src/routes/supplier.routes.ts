import express from 'express';
import {
  getAllSuppliers,
  SupplierById,
  SuppliersByName,
  SuppliersByDate, 
  SuppliersByDateRange,
  InventoryBySupplierId,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplier.controller';

const router = express.Router();


router.get('/suppliers', getAllSuppliers);
router.get('/suppliers/:id(\\d+)',SupplierById);
router.get('/suppliers/name/:name',SuppliersByName);
router.get('/suppliers/date/:date', SuppliersByDate);
router.get('/suppliers/daterange', SuppliersByDateRange);
router.get('/suppliers/inventory/:supplierId',InventoryBySupplierId);
router.post('/suppliers', createSupplier);
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

export default router;
