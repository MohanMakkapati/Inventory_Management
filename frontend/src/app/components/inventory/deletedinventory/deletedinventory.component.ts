import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router,RouterModule} from '@angular/router';
@Component({
  selector: 'app-deletedinventory',
  standalone:true,
  imports: [CommonModule,HttpClientModule,RouterModule],  
  templateUrl: './deletedinventory.component.html',
  styleUrl: './deletedinventory.component.css'
})
export class DeletedinventoryComponent {
  deletedInventory: any[] = [];
  loading = true;
  error = '';

  displayedColumns: string[] = ['inventory_id', 'description', 'deleted_on'];

  constructor(private inventoryService: InventoryService ) {}
  ngOnInit(): void {
    this.inventoryService.getDeletedInventory().subscribe({
      next: (data) => {
        this.deletedInventory = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading deleted inventory.';
        this.loading = false;
      },
    });
  }

  // to download the deleted inventory list 
  downloadCSV(): void {
    if (!this.deletedInventory || this.deletedInventory.length === 0) {
      return;
    }
  
    const headers = Object.keys(this.deletedInventory[0]);
    const csvRows: string[] = [];
  
    csvRows.push(headers.join(','));
    this.deletedInventory.forEach(item => {
      const row = headers.map(header => `"${(item as any)[header] ?? ''}"`).join(',');
      csvRows.push(row);
    });
  
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
  
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'deleted_inventory.csv';
    anchor.click();
  
    window.URL.revokeObjectURL(url);
  }
}
