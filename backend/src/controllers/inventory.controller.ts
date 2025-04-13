import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all inventory items
export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM inventory');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Create new inventory item
export const createInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, quantity, supplier_id } = req.body;

    if (!name || !category || quantity === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    //Check if supplier_id is valid if it's provided
    if (supplier_id !== null && supplier_id !== undefined) {
      const [supplierRows] = await pool.query('SELECT id FROM suppliers WHERE id = ?', [supplier_id]);
      if ((supplierRows as any[]).length === 0) {
        res.status(400).json({ error: 'Invalid supplier ID. Please check and try again.' });
        return;
      }
      
      const [existingRows] = await pool.query(
        'SELECT id FROM inventory WHERE name = ? AND supplier_id = ? AND category = ?',
        [name, supplier_id, category]
      );

      if ((existingRows as any[]).length > 0) {
        res.status(409).json({ error: 'Inventory with this name, category and supplier already exists. Consider adding quantity instead.' });
        return;
      }
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO inventory (name, category, quantity, supplier_id) VALUES (?, ?, ?, ?)',
      [name, category, quantity, supplier_id || null]
    );

    res.status(201).json({ message: 'Inventory item added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};


// Add quantity to an existing inventory item
export const addInventoryQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let { quantityToAdd } = req.body;

    quantityToAdd = Number(quantityToAdd);
   
    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      res.status(400).json({ error: 'quantityToAdd must be a positive number' });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE inventory SET quantity = quantity + ? WHERE id = ?',
      [quantityToAdd, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Inventory item not found' });
      return;
    }

    res.json({ message: `Successfully added ${quantityToAdd} to inventory item with ID ${id}` });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};


// Update inventory item
export const updateInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, quantity, supplier_id } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Inventory ID is required' });
      return;
    }

    const [existingRows] = await pool.query('SELECT * FROM inventory WHERE id = ?', [id]);
    if ((existingRows as any[]).length === 0) {
      res.status(404).json({ error: 'Inventory item not found' });
      return;
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (category) {
      updates.push('category = ?');
      values.push(category);
    }

    if (quantity !== undefined && quantity !== null && quantity !== '') {
      updates.push('quantity = ?');
      values.push(quantity);
    }

    if (supplier_id !== undefined) {
      if (supplier_id === null || supplier_id === 'null') {
        updates.push('supplier_id = NULL');
      } else {
        const [supplierCheck] = await pool.query('SELECT id FROM suppliers WHERE id = ?', [supplier_id]);
        if ((supplierCheck as any[]).length === 0) {
          res.status(400).json({ error: 'Invalid supplier ID' });
          return;
        }
        updates.push('supplier_id = ?');
        values.push(supplier_id);
      }
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No valid fields provided to update' });
      return;
    }

    const query = `UPDATE inventory SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await pool.query<ResultSetHeader>(query, values);

    res.json({ message: 'Inventory item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};


// Delete inventory item
export const deleteInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!description || description.trim() === '') {
      res.status(400).json({ error: 'Deletion description is required.' });
      return;
    }

    const [rows] = await pool.query('SELECT * FROM inventory WHERE id = ?', [id]);
    const inventory = (rows as any[])[0];

    if (!inventory) {
      res.status(404).json({ error: 'Inventory item not found' });
      return;
    }

    await pool.query(
      'INSERT INTO deleted_inventory (inventory_id, description) VALUES (?, ?)',
      [id, description]
    );

    await pool.query('DELETE FROM inventory WHERE id = ?', [id]);

    res.json({ message: `Inventory item with ID ${id} deleted and logged.` });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting inventory item.' });
  }
};

// to get all the inventory along with supplier details
export const getInventoryWithSupplier = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         i.id AS inventory_id,
         i.name AS inventory_name,
         i.category,
         i.quantity,
         i.supplier_id,
         i.created_at,
         s.name AS supplier_name,
         s.contact AS supplier_contact
       FROM inventory i
       LEFT JOIN suppliers s ON i.supplier_id = s.id
       ORDER BY i.id DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve inventory with supplier details' });
  }
};

// function to Issue inventory
export const issueInventory = async (req: Request, res: Response) => {
  const { inventory_id, department_id, quantity_issued } = req.body;
  
  if (!inventory_id || !department_id || !quantity_issued || quantity_issued <= 0) {
    res.status(400).json({ error: 'Invalid data provided' });
    return 
  }
  try {
    const [inventoryRows]: any = await pool.query(
      'SELECT quantity FROM inventory WHERE id = ?',
      [inventory_id]
    );
    if (inventoryRows.length === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const currentQuantity = inventoryRows[0].quantity;
    if (currentQuantity < quantity_issued) {
      return res.status(400).json({ error: 'Insufficient quantity in stock' });
    }
   
    const newQuantity = currentQuantity - quantity_issued;
    await pool.query(
      'UPDATE inventory SET quantity = ? WHERE id = ?',
      [newQuantity, inventory_id]
    );

    await pool.query(
      'INSERT INTO issued_inventory (inventory_id, department_id, quantity_issued) VALUES (?, ?, ?)',
      [inventory_id, department_id, quantity_issued]
    );
    res.status(200).json({
      message: 'Inventory issued successfully',
    });
  }
  catch(error){
    res.status(500).json({ error: 'Internal server error' });
  }
};

// to get issued inventory list 
export const getIssuedInventory = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         id,
         inventory_id,
         department_id,
         quantity_issued,
         issued_on
       FROM issued_inventory
       ORDER BY issued_on DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching issued inventory:', error);
    res.status(500).json({ message: 'Failed to retrieve issued inventory list' });
  }
};

// toGet issued list with corresponding department and inventory details
export const getIssuedInventoryDepartmentDetails = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        ii.id AS issued_id,
        ii.inventory_id,
        i.name AS inventory_name,
        i.category AS inventory_category,
        ii.department_id,
        d.name AS department_name,
        d.head_name AS department_head,
        d.contact AS department_contact,
        ii.quantity_issued,
        ii.issued_on
      FROM issued_inventory ii
      LEFT JOIN inventory i ON ii.inventory_id = i.id
      LEFT JOIN departments d ON ii.department_id = d.id
      ORDER BY ii.issued_on DESC`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching issued inventory list:', error);
    res.status(500).json({ message: 'Failed to retrieve issued inventory list.' });
  }
};

//Get deleted inventory table 
export const getDeletedInventory = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         id, 
         inventory_id, 
         description, 
         deleted_on 
       FROM deleted_inventory
       ORDER BY deleted_on DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching deleted inventory:', error);
    res.status(500).json({ message: 'Failed to retrieve deleted inventory data' });
  }
};

// Get all departments list
export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM departments ORDER BY id');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};