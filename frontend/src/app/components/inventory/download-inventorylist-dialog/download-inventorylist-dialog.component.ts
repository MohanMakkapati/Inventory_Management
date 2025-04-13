import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-download-inventorylist-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatCheckboxModule],
  templateUrl: './download-inventorylist-dialog.component.html',
  styleUrl: './download-inventorylist-dialog.component.css'
})
export class DownloadInventorylistDialogComponent {
  withSuppliers = false;
  constructor(
    public dialogRef: MatDialogRef<DownloadInventorylistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(this.withSuppliers); 
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
