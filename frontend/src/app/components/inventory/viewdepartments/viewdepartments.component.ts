import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router,RouterModule} from '@angular/router';
@Component({
  selector: 'app-viewdepartments',
  standalone:true,
  imports: [CommonModule,HttpClientModule,RouterModule],
  templateUrl: './viewdepartments.component.html',
  styleUrl: './viewdepartments.component.css'
})
export class ViewdepartmentsComponent {
  departments: any[] = [];
  loading = true;
  error = '';

  displayedColumns: string[] = ['id', 'name', 'head_name', 'contact','created_at'];

  constructor(private inventoryservice: InventoryService) {}

  ngOnInit(): void {
    this.inventoryservice.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load departments.';
        this.loading = false;
      }
    });
  }
   // to download the departments list 
   downloadCSV(): void {
    if (!this.departments || this.departments.length === 0) {
      return;
    }
  
    const headers = Object.keys(this.departments[0]);
    const csvRows: string[] = [];
  
    csvRows.push(headers.join(','));
    this.departments.forEach(item => {
      const row = headers.map(header => `"${(item as any)[header] ?? ''}"`).join(',');
      csvRows.push(row);
    });
  
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
  
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'departmentslist.csv';
    anchor.click();
  
    window.URL.revokeObjectURL(url);
  }
}
