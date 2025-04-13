import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { InventoryService } from '../../../services/inventory.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editdialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule,MatSnackBarModule],
  templateUrl: './editdialog.component.html',
  styleUrl: './editdialog.component.css'
})
export class EditdialogComponent {
  inventory = {
    id: null as number | null,
    name: '',
    category: '',
    quantity: null as number | null,
    supplier_id: '',
  };

  message = '';
  error = '';
  updatedFields: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.inventory.id = this.data.id;
  }
  //on update cliicking checking all the conditions
  onUpdate(): void {
    this.message = '';
    this.error = '';
    this.updatedFields = [];
  
    const payload: any = {};
    const updatedValues: string[] = [];
  
    if (!this.inventory.id) {
      this.error = 'Inventory ID is required';
      return;
    }
  
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
        const updatedSummary = updatedValues.length
        ? `Updated: ${updatedValues.join(', ')}`
        : 'No fields were updated';
    
      this.snackBar.open(
        `Inventory ID ${this.inventory.id} updated successfully. ${updatedSummary}`,
        'Close',
        {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }
      );
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to update inventory. Please try again.';
      }
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}  