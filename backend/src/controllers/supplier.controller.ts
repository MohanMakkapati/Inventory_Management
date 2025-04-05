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
export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM suppliers WHERE id = ?', [id]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'Supplier not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
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

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE suppliers SET name = ?, contact = ? WHERE id = ?',
      [name, contact || null, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Supplier not found' });
    } else {
      res.json({ message: 'Supplier updated' });
    }
  } catch (error) {
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
