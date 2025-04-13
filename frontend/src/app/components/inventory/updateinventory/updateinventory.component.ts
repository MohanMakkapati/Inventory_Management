import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { Inventoryitem } from '../../../models/inventoryitem.model';

@Component({
  selector: 'app-updateinventory',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, HttpClientModule, RouterModule],
  templateUrl: './updateinventory.component.html',
  styleUrl: './updateinventory.component.css'
})
export class UpdateinventoryComponent {
  inventory = {
    id: null as number | null,
    name: '',
    category: '',
    quantity: null as number | null,
    supplier_id: '', // Accepts string to handle 'null' as input
  };

  message = '';
  error = '';
  updatedFields: string[] = [];

  constructor(private inventoryService: InventoryService) {}

  onUpdate(): void {
    this.message = '';
    this.error = '';
    this.updatedFields = [];
  
    if (!this.inventory.id) {
      this.error = 'Inventory ID is required';
      return;
    }
  
    const payload: any = {};
    const updatedValues: string[] = [];
  
    if (this.inventory.name.trim()) {
      payload.name = this.inventory.name.trim();
      updatedValues.push(`Name: ${payload.name}`);
    }
  
    if (this.inventory.category.trim()) {
      payload.category = this.inventory.category.trim();
      updatedValues.push(`Category: ${payload.category}`);
    }
  
    if (this.inventory.quantity !== null && !isNaN(this.inventory.quantity)) {
      if (this.inventory.quantity < 0) {
        this.error = 'Quantity cannot be negative';
        return;
      }
      payload.quantity = this.inventory.quantity;
      updatedValues.push(`Quantity: ${payload.quantity}`);
    }
  
    if (this.inventory.supplier_id === 'null') {
      payload.supplier_id = null;
      updatedValues.push(`Supplier ID cleared`);
    } else if (this.inventory.supplier_id.trim()) {
      const supplierIdNumber = Number(this.inventory.supplier_id);
      if (!isNaN(supplierIdNumber)) {
        payload.supplier_id = supplierIdNumber;
        updatedValues.push(`Supplier ID: ${supplierIdNumber}`);
      }
    }
  
    this.inventoryService.updateInventory(this.inventory.id, payload).subscribe({
      next: () => {
        this.message = `Inventory item with ID ${this.inventory.id} updated successfully`;
        this.error = '';
        this.updatedFields = updatedValues;
  
        this.inventory.id = null;
        this.inventory.name = '';
        this.inventory.category = '';
        this.inventory.quantity = null;
        this.inventory.supplier_id = '';
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to update inventory. Please try again.';
        console.error(err);
      }
    });
  }
 }
