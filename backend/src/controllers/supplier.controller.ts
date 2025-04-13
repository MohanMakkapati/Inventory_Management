import { Request, Response } from 'express';
import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Get all suppliers
export const getAllSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM suppliers');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get supplier by ID
export const SupplierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM suppliers WHERE id = ?',
      [id]
    );

    if ((rows as RowDataPacket[]).length === 0) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching supplier by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get supplier rows by name 
export const SuppliersByName = async (req: Request, res: Response) => {
  try {
    const name = req.params.name.toLowerCase(); // Convert input to lowercase
    const [rows] = await pool.query(
      'SELECT * FROM suppliers WHERE LOWER(name) LIKE ?',
      [`${name}`]
    );

    if ((rows as any[]).length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: '${name}' });
    }
  } catch (error) {
    console.error('Error fetching supplier by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// get suppliers by specific date (format: YYYY-MM-DD)
export const SuppliersByDate = async (req: Request, res: Response) => {
  const { date } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM suppliers WHERE DATE(created_at) = ?',
      [date]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers by date', error });
  }
};

// Get suppliers by date range
export const SuppliersByDateRange = async (req: Request, res: Response) => {
  const start = req.query.start as string;
  const end = req.query.end as string;

  if (!start || !end) {
    return res.status(400).json({ message: 'Start and end dates are required in query params' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM suppliers WHERE DATE(created_at) BETWEEN ? AND ?',
      [start, end]
    );
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: 'No suppliers found for the given date range' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Error fetching suppliers by date range', error });
  }
};

// Create new supplier
export const createSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, contact } = req.body;

    if (!name || name.trim() === '') {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO suppliers (name, contact) VALUES (?, ?)',
      [name, contact || null]
    );

    res.status(201).json({ message: 'Supplier added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update supplier
export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, contact } = req.body;

    const [rows]: any = await pool.query('SELECT * FROM suppliers WHERE id = ?', [id]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    const existingSupplier = rows[0];

    const updatedName = name !== undefined && name.trim() !== '' ? name : existingSupplier.name;
    const updatedContact =
      contact !== undefined && contact.trim() !== '' ? contact : existingSupplier.contact;

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE suppliers SET name = ?, contact = ? WHERE id = ?',
      [updatedName, updatedContact, id]
    );
    res.json({
      message: 'Supplier updated successfully',
      updatedFields: {
        name: updatedName !== existingSupplier.name,
        contact: updatedContact !== existingSupplier.contact,
      },
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete supplier
export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM suppliers WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Supplier not found' });
    } else {
      res.json({ message: 'Supplier deleted' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get inventory rows by supplier ID using JOIN
export const InventoryBySupplierId = async (req: Request, res: Response): Promise<void> => {
  const { supplierId } = req.params;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT i.* FROM inventory i
       JOIN 
       suppliers s ON i.supplier_id = s.id WHERE s.id = ?`,[supplierId]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: 'No inventory found for this supplier.' });
      return;
    }

    res.json(rows);
  } catch (error) {
    console.error('Error fetching inventory by supplier ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
