import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { SuppliersService } from '../../../services/suppliers.service';
import { Inventoryitem } from '../../../models/inventoryitem.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router,RouterModule} from '@angular/router';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AddquantitydialogComponent } from '../addquantitydialog/addquantitydialog.component';
import { IssueitemDialogComponent } from '../issueitem-dialog/issueitem-dialog.component';
import { EditdialogComponent } from '../editdialog/editdialog.component';
import { DeletedialogComponent } from '../deletedialog/deletedialog.component';
import { DownloadInventorylistDialogComponent } from '../download-inventorylist-dialog/download-inventorylist-dialog.component';
@Component({
  selector: 'app-viewinventory',
  standalone:true,
  imports: [CommonModule,HttpClientModule,MatDialogModule,RouterModule,MatSnackBarModule],  
  templateUrl: './viewinventory.component.html',
  styleUrl: './viewinventory.component.css'
})
export class ViewinventoryComponent  implements OnInit {
  inventory: Inventoryitem[] = [];
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
        this.loading = false;
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
          this.loadInventory(); 
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
        this.loadInventory();
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
        this.loadInventory();
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
            this.loadInventory();
          },
          error: (err) => {
            this.snackBar.open('Failed to delete item.', 'Close', { duration: 3000 });
            console.error(err);
          }
        });
      }
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
      if (withSuppliers) {
        this.inventoryService.getInventoryWithSuppliers().subscribe(data => {
          this.generateCSV(data,true);
        });
      } else {
        this.generateCSV(this.inventory,false);
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
      anchor.download = withSuppliers ? 'inventory_with_suppliers.csv' : 'inventory.csv';
      anchor.click();
      window.URL.revokeObjectURL(url);
    }
    
}
