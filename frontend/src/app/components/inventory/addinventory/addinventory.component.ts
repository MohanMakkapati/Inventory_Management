import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InventoryService } from '../../../services/inventory.service';
import { Inventoryitem } from '../../../models/inventoryitem.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-addinventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './addinventory.component.html',
  styleUrl: './addinventory.component.css'
})
export class AddinventoryComponent {
  inventory: Partial<Inventoryitem> = {
    name: '',
    category: '',
    quantity: 0,
    supplier_id: null
  };

  inventoryIdToUpdate: number | null = null;
  quantityToAdd: number | null = null;

  showAddForm = true;
  showQuantityForm = false;

  message = '';
  error = '';
  addedInventory: Inventoryitem | null = null;

  constructor(private inventoryService: InventoryService, private http: HttpClient) {}

  toggleForm(type: 'add' | 'quantity'): void {
    this.showAddForm = type === 'add';
    this.showQuantityForm = type === 'quantity';
    this.message = '';
    this.error = '';
    this.addedInventory = null;
  }

  onSubmit(): void {
    this.message = '';
    this.error = '';
    this.addedInventory = null;

    if (!this.inventory.name?.trim()) {
      this.error = 'Item name is required';
      return;
    }
    if ((this.inventory.quantity ?? 0) < 0) {
      this.error = 'Quantity cannot be negative';
      return;
    }
    this.inventoryService.addInventory(this.inventory as Inventoryitem).subscribe({
      next: (res) => {
        this.message = 'Inventory item added successfully!';
        this.addedInventory = {
          id: res.id,
          name: this.inventory.name || '',
          category: this.inventory.category || '',
          quantity: this.inventory.quantity || 0,
          supplier_id: this.inventory.supplier_id || null,
          created_at: new Date().toISOString()
        };
        this.inventory = { name: '', category: '', quantity: 0, supplier_id: null };
      },
      error: (err) => {
        this.error = err.error?.error || 'Error adding inventory item';
      }
    });
  }

  onAddQuantity(): void {
    this.message = '';
    this.error = '';
    
    if (!this.inventoryIdToUpdate || !this.quantityToAdd) {
      this.error = 'Please enter Inventory ID and quantity to add.';
      return;
    }
    const qty = Number(this.quantityToAdd);
    if (!qty || typeof qty !== 'number' || qty < 0) {
      this.error = 'Please enter a valid Inventory ID and quantity to add.';
      return;
    }

    this.inventoryService.addQuantity(this.inventoryIdToUpdate,qty).subscribe({
      next: () => {
        this.message = `Quantity ${this.quantityToAdd} successfully added to inventory item ID ${this.inventoryIdToUpdate}`;
        this.inventoryIdToUpdate = null;
        this.quantityToAdd = null;
      },
      error: (err) => {
        this.error = err.error?.error || 'Error adding quantity';
      }
    });
  }
}
