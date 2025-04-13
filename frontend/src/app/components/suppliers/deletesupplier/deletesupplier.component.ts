import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuppliersService } from '../../../services/suppliers.service';
import { Supplieritem } from '../../../models/supplieritem.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-deletesupplier',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule,HttpClientModule,RouterModule],
  templateUrl: './deletesupplier.component.html',
  styleUrl: './deletesupplier.component.css'
})
export class DeletesupplierComponent{
  supplierId: number | null = null;
  message: string = '';
  error: string = '';
  timeoutRef: any;
  constructor(private supplierService: SuppliersService) {}

  onDelete(): void {
    this.message = '';
    this.error = '';

    if (this.supplierId === null || isNaN(this.supplierId)) {
      this.error = 'Please enter a valid Supplier ID';
      return;
    }

    this.supplierService.deleteSupplier(this.supplierId).subscribe({
      next: () => {
        this.message = `Supplier with ID ${this.supplierId} deleted successfully.`;
        this.supplierId = null;
      },

      error: (err) => {
        this.error = 'Failed to delete supplier. Please check the ID.';
        console.error(err);
      }
    });
  }
}
