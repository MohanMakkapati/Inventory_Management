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
  selector: 'app-updatesupplier',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule,HttpClientModule,RouterModule],
  templateUrl: './updatesupplier.component.html',
  styleUrl: './updatesupplier.component.css'
})
export class UpdatesupplierComponent {
  supplier = {
    id: null as number | null,
    name: '',
    contact: ''
  };

  message = '';
  error = '';
  updatedFields: string[] = [];

  constructor(private supplierService: SuppliersService) {}

  onUpdate() {
    this.updatedFields = [];
    this.message = '';
    this.error = '';

    if (!this.supplier.id) {
      this.error = 'Supplier ID is required!';
      return;
    }

    const updateData: any = {};
    if (this.supplier.name.trim()) {
      updateData.name = this.supplier.name;
      this.updatedFields.push(`Name: ${this.supplier.name}`);
    }

    if (this.supplier.contact.trim()) {
      updateData.contact = this.supplier.contact;
      this.updatedFields.push(`Contact: ${this.supplier.contact}`);
    }

    if (Object.keys(updateData).length === 0) {
      this.error = 'No fields to update!';
      return;
    }

    this.supplierService.updateSupplier(this.supplier.id, updateData).subscribe({
      next: () => {
        this.message = `Supplier ${this.supplier.id} updated successfully!`;
        this.supplier = {
          id: null,
          name: '',
          contact: ''
        };
      },
      error: (err) => {
        this.error = 'Update failed. ' + (err.error?.error || '');
        this.updatedFields = [];
      }
    });
  }
}
