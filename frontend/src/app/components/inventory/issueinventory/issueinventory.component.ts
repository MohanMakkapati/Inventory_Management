import { Component,OnInit,ViewChild } from '@angular/core';
import { FormsModule,NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InventoryService } from '../../../services/inventory.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-issueinventory',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './issueinventory.component.html',
  styleUrl: './issueinventory.component.css'
})
export class IssueinventoryComponent implements OnInit{
  departments: any[] = [];
  inventoryId: number | null = null;
  departmentId: number | null = null;
  quantity: number | null = null;

  successMessage = '';
  errorMessage = '';

  @ViewChild('issueForm') issueForm!: NgForm;
  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.inventoryService.getDepartments().subscribe({
      next: (data) => (this.departments = data),
      error: () => (this.errorMessage = 'Failed to load departments'),
    });
  }

  issueinventory(): void {
    if (
      this.inventoryId &&
      this.departmentId &&
      this.quantity &&
      this.quantity > 0
    ) {
      this.inventoryService.issueInventory(
        this.inventoryId,this.departmentId, this.quantity
      ).subscribe({
        next: (response: any) => {
          this.successMessage =  
           `inventory :${this.inventoryId} issued to departmentid:${this.departmentId} successfully! quantiy=${this.quantity}`;
          this.errorMessage = '';
          this.issueForm.resetForm();
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to issue inventory';
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'All fields are required';
      this.successMessage = '';
    }
  }
}
