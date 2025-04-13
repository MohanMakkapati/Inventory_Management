import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { InventoryService } from '../../../services/inventory.service';
import { SuppliersService } from '../../../services/suppliers.service';
import { Inventoryitem } from '../../../models/inventoryitem.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router,RouterModule} from '@angular/router';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AddquantitydialogComponent } from '../addquantitydialog/addquantitydialog.component';
import { IssueitemDialogComponent } from '../issueitem-dialog/issueitem-dialog.component';
import { EditdialogComponent } from '../editdialog/editdialog.component';
import { DeletedialogComponent } from '../deletedialog/deletedialog.component';
import { DownloadInventorylistDialogComponent } from '../download-inventorylist-dialog/download-inventorylist-dialog.component';
@Component({
  selector: 'app-filterinventory',
  standalone:true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    RouterModule,
    MatSnackBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule  
  ],  
  templateUrl: './filterinventory.component.html',
  styleUrl: './filterinventory.component.css'
})
export class FilterinventoryComponent {
  inventory: Inventoryitem[] = [];
  filteredInventory: Inventoryitem[] = [];
  allCategories: string[] = [];
  searchId: number | null = null;
  searchName: string = '';
  selectedCategory: string = '';
  stockStatus: string = 'all';
  loading: boolean = true;
  error: string = '';

  constructor(
    private inventoryService: InventoryService,
    private suppliersService: SuppliersService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.inventoryService.getAllInventory().subscribe(
      (data) => {
        this.inventory = data;
        this.filteredInventory = data;
        this.loading = false;
        this.allCategories = Array.from(
          new Set(data.map(item => item.category?.toLowerCase()))
        );
      },
      (err) => {
        this.error = 'Error fetching inventory data';
        this.loading = false;
      }
    );
  }

  // showing supplier details based on the id
  expandedSupplier: { [key: number]: any } = {};

  toggleSupplierDetails(item: Inventoryitem): void {
    if (this.expandedSupplier[item.id]) {
      delete this.expandedSupplier[item.id];
    } else if (item.supplier_id) {
      this.suppliersService.getSupplierById(item.supplier_id).subscribe(
        (supplierData) => {
          this.expandedSupplier[item.id] = supplierData;
        },
        (error) => {
          console.error('Failed to fetch supplier details', error);
        }
      );
    }
  }

  // adding quantity
  onAddQuantity(item: Inventoryitem): void {
    const dialogRef = this.dialog.open(AddquantitydialogComponent, {
      width: '300px',
      data: { itemId: item.id }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result?.quantityToAdd) {
        this.inventoryService.addQuantity(item.id, result.quantityToAdd).subscribe(() => {
          this.snackBar.open('Quantity added successfully!', 'Close', { duration: 3000 });
          this.loadFilterInventory(); 
        }, err => {
          this.snackBar.open('Failed to add quantity.', 'Close', { duration: 3000 });
        });
      }
    });
  }

  // opening issue dialog
  openIssueDialog(inventoryId: number): void {
    const dialogRef = this.dialog.open(IssueitemDialogComponent, {
      width: '500px',
      maxHeight: 'none',
      panelClass: 'custom-dialog-container',
      data: { inventoryId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFilterInventory();
      }
    });
  }  

  // opening edit dialog
  openEditDialog(itemId: number) {
    const dialogRef = this.dialog.open(EditdialogComponent, {
      width: '600px',
      maxHeight: 'none',
      panelClass: 'custom-dialog-container',
      data: { id: itemId },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFilterInventory();
      }
    });
  }

  // openiong delete dialog
  openDeleteDialog(id: number): void {
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '400px',
      data: { id }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.inventoryService.deleteInventory(id, result.description).subscribe({
          next: () => {
            this.snackBar.open(`Deleted item ID ${id}. Reason: ${result.description}`, 'Close', { duration: 3000 });
            this.loadFilterInventory();
          },
          error: (err) => {
            this.snackBar.open('Failed to delete item.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

 //to apply filters
 applyFilter(): void {
  const idTerm = this.searchId !== null ? this.searchId.toString().trim() : '';
  const nameTerm = this.searchName.trim().toLowerCase();
  const categoryTerm = this.selectedCategory;
  const stockFilter = this.stockStatus;

  this.filteredInventory = this.inventory.filter(item => {
    const matchesId = !idTerm || item.id.toString() === idTerm;;
    const matchesName = !nameTerm || item.name.toLowerCase().startsWith(nameTerm);;
    const matchesCategory = !categoryTerm || item.category.toLowerCase() === categoryTerm;

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in' && item.quantity > 0) ||
      (stockFilter === 'out' && item.quantity === 0);

    return matchesId && matchesName && matchesCategory && matchesStock;
  });
}

loadFilterInventory(): void {
  this.inventoryService.getAllInventory().subscribe(
    (data) => {
      this.inventory = data;
      this.loadFilteredInventory(data); 
      this.loading = false;
      this.allCategories = Array.from(
        new Set(data.map(item => item.category?.toLowerCase())) 
      );
    },
    (err) => {
      this.error = 'Error fetching inventory data';
      this.loading = false;
    }
  );
}

loadFilteredInventory(data: Inventoryitem[]): void {
  const idTerm = this.searchId !== null ? this.searchId.toString().trim() : '';
  const nameTerm = this.searchName.trim().toLowerCase();
  const categoryTerm = this.selectedCategory?.toLowerCase(); 
  const stockFilter = this.stockStatus;

  this.filteredInventory = data.filter(item => {
    const matchesId = !idTerm || item.id.toString() === idTerm;
    const matchesName = !nameTerm || item.name.toLowerCase().startsWith(nameTerm);
    const matchesCategory = !categoryTerm || item.category.toLowerCase() === categoryTerm;

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in' && item.quantity > 0) ||
      (stockFilter === 'out' && item.quantity === 0);

    return matchesId && matchesName && matchesCategory && matchesStock;
  });
}

  confirmDownload(): void {
    const dialogRef = this.dialog.open(DownloadInventorylistDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.downloadCSV(true); 
      } else if (result === false) {
        this.downloadCSV(false);
      }
    });
  }
  downloadCSV(withSuppliers: boolean): void {
    const dataToDownload = this.filteredInventory;
    if (!dataToDownload || dataToDownload.length === 0) {
      this.snackBar.open('No data to download.', 'Close', { duration: 3000 });
      return;
    }
    if (withSuppliers) {
      const supplierRequests = dataToDownload.map(item =>
        item.supplier_id
          ? firstValueFrom(this.suppliersService.getSupplierById(item.supplier_id))
          : Promise.resolve(null)
      );

      Promise.all(supplierRequests).then(suppliers => {
        const mergedData = dataToDownload.map((item, index) => {
          const supplier = suppliers[index];
          return {
            ...item,
            supplier_name: supplier?.name ?? '',
            supplier_contact: supplier?.contact ?? ''
          };
        });
        this.generateCSV(mergedData, true);
      }).catch(err => {
        console.error('Error fetching supplier details for download', err);
        this.snackBar.open('Failed to fetch supplier info for download.', 'Close', { duration: 3000 });
      });
  
    } else {
      this.generateCSV(dataToDownload, false);
    }
  }

  generateCSV(data: any[],withSuppliers: boolean): void {
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
    anchor.download = withSuppliers ? 'filterdinventory_with_suppliers.csv' : 'filteredinventory.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

}
