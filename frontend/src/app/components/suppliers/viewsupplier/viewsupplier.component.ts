import { Component, OnInit } from '@angular/core';
import { SuppliersService } from '../../../services/suppliers.service';
import { Supplieritem } from '../../../models/supplieritem.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router,RouterModule} from '@angular/router';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { EditSupplierDialogComponent } from '../edit-supplier-dialog/edit-supplier-dialog.component';
import { ViewinventorybysupplieridComponent } from '../viewinventorybysupplierid/viewinventorybysupplierid.component';
import { DownloadSupplierslistDialogComponent } from '../download-supplierslist-dialog/download-supplierslist-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-supplier',
  standalone: true,
  imports: [CommonModule,HttpClientModule, MatDialogModule,RouterModule,MatSnackBarModule], 
  templateUrl: './viewsupplier.component.html',
  styleUrls: ['./viewsupplier.component.css']
})
export class ViewsupplierComponent implements OnInit {
  suppliers: Supplieritem[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private supplierService: SuppliersService, 
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(
      (data) => {
        this.suppliers = data;
        this.loading = false;
      },
      (err) => {
        this.error = 'Error fetching supplier data';
        this.loading = false;
      }
    );
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.supplierService.deleteSupplier(id).subscribe(() => {
          this.suppliers = this.suppliers.filter(s => s.id !== id);
          
          this.snackBar.open(`Deleted Supplier ID: ${id}`, 'Close', {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['custom-snackbar']
          });
        });
      }
    });
  }

  openEditDialog(supplier: Supplieritem): void {
    const dialogRef = this.dialog.open(EditSupplierDialogComponent, {
      data: { ...supplier }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.supplierService.updateSupplier(result.id, {
          name: result.name,
          contact: result.contact
        }).subscribe({
          next: () => {
            this.loadSuppliers()
            this.snackBar.open(`Updated Supplier ID: ${result.id}`, 'Close', {
              duration: 1000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['custom-snackbar']
            });
          },
          error: (err) => {
            console.error('Update failed', err)
          
            this.snackBar.open(`Failed to update Supplier ID: ${result.id}`, 'Close', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  //to get the inventory items of supplierid
  openInventoryDialog(supplierId: number): void {
    this.supplierService.getInventoryBySupplierId(supplierId).subscribe({
      next: (inventoryData) => {
        this.dialog.open(ViewinventorybysupplieridComponent, {
          width: '1000px',
          data: inventoryData
        });
      },
      error: (err) => {
        console.error('Failed to fetch inventory', err);
      
        const backendMessage = err?.error?.message || 'Failed to fetch inventory';
      
        this.snackBar.open(backendMessage, 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
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
    if (!this.suppliers || this.suppliers.length === 0) {
      console.warn('No supplier data to download.');
      return;
    }
  
    const headers = Object.keys(this.suppliers[0]);
    const csvRows: string[] = [];
  
    csvRows.push(headers.join(','));
  
    this.suppliers.forEach(supplier => {
      const row = headers.map(header => `"${(supplier as any)[header] ?? ''}"`).join(',');
      csvRows.push(row);
    });
  
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
  
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'suppliers.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }  

}
