import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DownloadSupplierslistDialogComponent } from '../download-supplierslist-dialog/download-supplierslist-dialog.component';

@Component({
  selector: 'app-viewinventorybysupplierid',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, MatSelectModule, MatButtonModule],
  templateUrl: './viewinventorybysupplierid.component.html',
  styleUrl: './viewinventorybysupplierid.component.css'
})
export class ViewinventorybysupplieridComponent {
  filteredInventory: any[] = [];
  stockFilter: string = 'all';

  constructor(
    public dialogRef: MatDialogRef<ViewinventorybysupplieridComponent>,
    @Inject(MAT_DIALOG_DATA) public inventory: any[],
    private dialog: MatDialog
  ) {}
   
  ngOnInit(): void {
    this.applyFilter(); 
  }

  applyFilter(): void {
    switch (this.stockFilter) {
      case 'instock':
        this.filteredInventory = this.inventory.filter(item => item.quantity > 0);
        break;
      case 'outofstock':
        this.filteredInventory = this.inventory.filter(item => item.quantity === 0);
        break;
      default:
        this.filteredInventory = [...this.inventory];
    }
  }

   confirmDownload(): void {
      const dialogRef = this.dialog.open(DownloadSupplierslistDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.downloadCSV();
        }
      });
    }
  
  downloadCSV(): void {
    if (!this.filteredInventory || this.filteredInventory.length === 0) return;
  
    const headers = Object.keys(this.filteredInventory[0]);
    const csvRows = [];
  
    csvRows.push(headers.join(',')); // header
    for (const row of this.filteredInventory) {
      csvRows.push(headers.map(header => `"${(row as any)[header] ?? ''}"`).join(','));
    }
  
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
}
