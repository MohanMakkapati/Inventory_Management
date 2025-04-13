import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuppliersService } from '../../../services/suppliers.service';
import { Supplieritem } from '../../../models/supplieritem.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-addsupplier',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule,HttpClientModule,RouterModule ],
  templateUrl: './addsupplier.component.html',
  styleUrl: './addsupplier.component.css'
})
export class AddsupplierComponent {
  supplier: Supplieritem = {
    name: '',
    contact: ''
  };
  message = '';
  error = '';
  addedSupplier: Supplieritem | null = null;
  constructor(private supplierService: SuppliersService) {}

  onSubmit(): void {
    this.message = '';
    this.error = '';
    this.addedSupplier = null;
    if (!this.supplier.name.trim()) {
      this.error = 'Name is required';
      return;
    }
    this.supplierService.addSupplier(this.supplier).subscribe({
      next: (res) => {
        this.message = 'Supplier added successfully!';
        this.addedSupplier = {
          id: res.id,
          name: this.supplier.name || '',
          contact: this.supplier.contact || '',
          created_at: new Date().toISOString()
        };
        this.supplier = { name: '', contact: '' };
      },
      error: (err) => {
        this.error = err.error?.error || 'Error adding supplier';
      }
    });
  }
}
