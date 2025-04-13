import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-supplier-dialog',
  standalone: true,
  imports: [CommonModule,FormsModule,MatButtonModule,MatInputModule,MatDialogTitle, MatDialogContent, MatDialogActions],
  template: `
  <h2 mat-dialog-title>Edit Supplier</h2>
  <mat-dialog-content>
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>Name</mat-label>
      <input matInput [(ngModel)]="data.name" />
    </mat-form-field>

    <mat-form-field appearance="outline" class="full-width">
      <mat-label>Contact</mat-label>
      <input matInput [(ngModel)]="data.contact" />
    </mat-form-field>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button (click)="dialogRef.close()">Cancel</button>
    <button mat-button color="primary" (click)="save()">Save</button>
  </mat-dialog-actions>
`,
styles: [`
  .full-width {
    width: 100%;
  }
`]
})
export class EditSupplierDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditSupplierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; name: string; contact: string }
  ) {}

  save(): void {
    this.dialogRef.close(this.data); // Send updated data back to the component
  }
}
