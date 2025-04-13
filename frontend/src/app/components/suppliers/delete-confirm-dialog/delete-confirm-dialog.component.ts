import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatDialogTitle,MatDialogContent,MatDialogActions],
  template: `
  <h2 mat-dialog-title>Confirm Deletion</h2>
  <mat-dialog-content>Are you sure you want to delete supplier with ID {{ data.id }}?</mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button (click)="dialogRef.close(false)">Cancel</button>
    <button mat-button color="warn" (click)="dialogRef.close(true)">Delete</button>
  </mat-dialog-actions>
`
})
export class DeleteConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}
}
