// src/routes/inventory.routes.ts
import express from 'express';
import {
  getInventory,
  getInventoryWithSupplier,
  issueInventory,
  getIssuedInventory,
  getIssuedInventoryDepartmentDetails,
  getDeletedInventory,
  createInventory,
  addInventoryQuantity,
  updateInventory,
  deleteInventory,
  getAllDepartments
} from '../controllers/inventory.controller';

const router = express.Router();

router.get('/inventory', getInventory);
router.get('/inventory/details/with-suppliers', getInventoryWithSupplier);
router.post('/inventory/issue/byid', issueInventory);
router.get('/inventory/issued/details', getIssuedInventory);
router.get('/inventory/issuedinventorydepartment/details', getIssuedInventoryDepartmentDetails);
router.get('/inventory/deleted/details', getDeletedInventory);
router.post('/inventory', createInventory);
router.put('/inventory/add-quantity/:id', addInventoryQuantity);
router.put('/inventory/:id', updateInventory);
router.delete('/inventory/:id', deleteInventory);
router.get('/inventory/departments/details', getAllDepartments);
export default router;
