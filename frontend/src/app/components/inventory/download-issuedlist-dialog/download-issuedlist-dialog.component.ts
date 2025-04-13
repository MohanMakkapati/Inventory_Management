import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-download-issuedlist-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatCheckboxModule],
  templateUrl: './download-issuedlist-dialog.component.html',
  styleUrl: './download-issuedlist-dialog.component.css'
})
export class DownloadIssuedlistDialogComponent {
  withinventorydepartment = false;
  constructor(
    public dialogRef: MatDialogRef<DownloadIssuedlistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(this.withinventorydepartment); 
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
