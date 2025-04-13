import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router,RouterModule} from '@angular/router';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import { DownloadIssuedlistDialogComponent} from '../download-issuedlist-dialog/download-issuedlist-dialog.component';
@Component({
  selector: 'app-viewissuedlist',
  standalone:true,
  imports: [CommonModule,HttpClientModule,RouterModule,MatDialogModule], 
  templateUrl: './viewissuedlist.component.html',
  styleUrl: './viewissuedlist.component.css'
})
export class ViewissuedlistComponent {
  issuedInventory: any[] = [];
  loading = true;
  error = '';

  constructor(private inventoryService: InventoryService,private dialog: MatDialog,) {}

  ngOnInit(): void {
    this.inventoryService.getIssuedInventory().subscribe({
      next: (data) => {
        this.issuedInventory = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load issued inventory.';
        this.loading = false;
      }
    });
  }

   confirmDownload(): void {
        const dialogRef = this.dialog.open(DownloadIssuedlistDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.downloadCSV(true); 
          } else if (result === false) {
            this.downloadCSV(false);
          }
        });
      }

   downloadCSV(withinventorydepartment: boolean): void {
        if (withinventorydepartment) {
          this.inventoryService.getIssuedInventoryDepartmentDetails().subscribe(data => {
            this.generateCSV(data,true);
          });
        } else {
          this.generateCSV(this.issuedInventory,false);
        }
      }
      generateCSV(data: any[],withinventorydepartment: boolean): void {
        if (!data || data.length === 0) {
          console.warn('No data to download.');
          return;
        }
      
        const headers = Object.keys(data[0]);
        const csvRows = [];
      
        csvRows.push(headers.join(','));
        data.forEach(item => {
          const row = headers.map(header => `"${(item as any)[header] ?? ''}"`).join(',');
          csvRows.push(row);
        });
      
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
      
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = withinventorydepartment ? 'issued_with_inventoryanddepartment.csv' : 'issuedlist.csv';
        anchor.click();
        window.URL.revokeObjectURL(url);
      }
}

