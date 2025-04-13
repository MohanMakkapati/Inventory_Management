import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-deleteinventory',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, RouterModule],
  templateUrl: './deleteinventory.component.html',
  styleUrl: './deleteinventory.component.css'
})
export class DeleteinventoryComponent {
  inventoryId: number | null = null;
  description: string = '';
  message: string = '';
  error: string = '';

  constructor(private inventoryService: InventoryService) {}

  onDelete(): void {
    this.message = '';
    this.error = '';

    if (!this.inventoryId || !this.description.trim()) {
      this.error = 'Please enter Inventory ID and description.';
      return;
    }

    this.inventoryService.deleteInventory(this.inventoryId, this.description).subscribe({
      next: () => {
        this.message = `Inventory item with ID ${this.inventoryId} deleted successfully.`;
        this.inventoryId = null;
        this.description = '';
      },
      error: (err) => {
        this.error = 'Failed to delete inventory item. Please check the ID.';
        console.error(err);
      }
    });
  }
}
