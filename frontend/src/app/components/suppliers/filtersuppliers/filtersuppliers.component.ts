import { Component } from '@angular/core';
import { SuppliersService } from '../../../services/suppliers.service';
import { Supplieritem } from '../../../models/supplieritem.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { EditSupplierDialogComponent } from '../edit-supplier-dialog/edit-supplier-dialog.component';
import { ViewinventorybysupplieridComponent } from '../viewinventorybysupplierid/viewinventorybysupplierid.component';
import { DownloadSupplierslistDialogComponent } from '../download-supplierslist-dialog/download-supplierslist-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtersuppliers',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    RouterModule,
    MatSnackBarModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule, 
    MatInputModule,   
    MatButtonModule 
  ],
  providers: [DatePipe],
  templateUrl: './filtersuppliers.component.html',
  styleUrl: './filtersuppliers.component.css',
})
export class FiltersuppliersComponent {
  filterId: string = '';
  filterName: string = '';
  dateFilterType: string = '';
  filterDate: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  filteredSuppliers: Supplieritem[] = [];

  constructor(
    private supplierService: SuppliersService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  //dialog for delete button
  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.filteredSuppliers = this.filteredSuppliers.filter(s => s.id !== id);
        this.supplierService.deleteSupplier(id).subscribe(() => {
          this.snackBar.open(`Deleted Supplier ID: ${id}`, 'Close', {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['custom-snackbar'],
          });
        });
      }
    });
  }

  //dialog for edit
  openEditDialog(supplier: Supplieritem): void {
    const dialogRef = this.dialog.open(EditSupplierDialogComponent, {
      data: { ...supplier },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.supplierService
          .updateSupplier(result.id, {
            name: result.name,
            contact: result.contact,
          })
          .subscribe({
            next: () => {
              this.searchSupplierById();
              const index = this.filteredSuppliers.findIndex(s => s.id === result.id);
              if (index !== -1) {
                this.filteredSuppliers[index] = {
                ...this.filteredSuppliers[index],
                name: result.name,
                contact: result.contact,
              };
            }
              this.snackBar.open(`Updated Supplier ID: ${result.id}`, 'Close', {
                duration: 1000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['custom-snackbar'],
              });
            },
            error: (err) => {
              console.error('Update failed', err);
              this.snackBar.open(`Failed to update Supplier ID: ${result.id}`, 'Close', {
                duration: 2000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              });
            },
          });
      }
    });
  }

  // to get the inventory items of supplier
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

  //function for confirm download button
  confirmDownload(): void {
    const dialogRef = this.dialog.open(DownloadSupplierslistDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.downloadCSV();
      }
    });
  }
  //dialog to confirm the download
  downloadCSV(): void {
    if (!this.filteredSuppliers.length) return;

    const headers = Object.keys(this.filteredSuppliers[0]);
    const csvRows = [headers.join(',')];

    this.filteredSuppliers.forEach((supplier) => {
      const row = headers.map((h) => `"${(supplier as any)[h] ?? ''}"`).join(',');
      csvRows.push(row);
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'filtered_suppliers.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  searchSupplierById(): void {
    if (!this.filterId.trim()) return;

    this.supplierService.getSupplierById(Number(this.filterId)).subscribe({
      next: (res) => {
        this.filteredSuppliers = res ? [res] : [];
      },
      error: () => {
        this.filteredSuppliers = [];
      },
    });

    this.filterId = '';
  }

  searchSupplierByName(): void {
    if (!this.filterName.trim()) return;
  
    this.supplierService.getSupplierByName(this.filterName.trim()).subscribe({
      next: (res) => {
        this.filteredSuppliers = res || [];
      },
      error: (err) => {
        console.error('Name search error:', err);
        this.filteredSuppliers = [];
      },
    });
  
    this.filterName = ''; 
  }

  //daterange validation
  isDateRangeValid(): boolean {
    if (!this.startDate || !this.endDate) return true;
    return new Date(this.startDate) <= new Date(this.endDate);
  }
  
  searchSupplierByDate(): void {
    if (this.filterDate) {
      const formattedDate = this.datePipe.transform(this.filterDate, 'yyyy-MM-dd');
      this.supplierService.getSuppliersByDate(formattedDate!).subscribe({
        next: (res) => (this.filteredSuppliers = res),
        error: () => (this.filteredSuppliers = [])
      });
    }
  }

  searchSupplierByDateRange(): void {
    if (this.startDate && this.endDate) {
      const start = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
      const end = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
      this.supplierService.getSuppliersByDateRange(start!, end!).subscribe({
        next: (res) => (this.filteredSuppliers = res),
        error: () => (this.filteredSuppliers = [])
      });
    }
  }

}