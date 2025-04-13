import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-download-supplierslist-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './download-supplierslist-dialog.component.html',
})
export class DownloadSupplierslistDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DownloadSupplierslistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
