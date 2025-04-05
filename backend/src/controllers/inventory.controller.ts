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

// Get inventory item by ID
export const getInventoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM inventory WHERE id = ?', [id]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json(rows[0]);
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

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO inventory (name, category, quantity, supplier_id) VALUES (?, ?, ?, ?)',
      [name, category, quantity, supplier_id || null]
    );

    res.status(201).json({ message: 'Inventory item added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update inventory item
export const updateInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, quantity, supplier_id } = req.body;

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE inventory SET name = ?, category = ?, quantity = ?, supplier_id = ? WHERE id = ?',
      [name, category, quantity, supplier_id || null, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json({ message: 'Inventory item updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Delete inventory item
export const deleteInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>('DELETE FROM inventory WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json({ message: 'Inventory item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
