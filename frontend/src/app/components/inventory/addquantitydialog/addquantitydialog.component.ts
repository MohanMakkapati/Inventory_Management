import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-addquantitydialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './addquantitydialog.component.html',
  styleUrl: './addquantitydialog.component.css'
})
export class AddquantitydialogComponent {
  quantityToAdd: number = 0;

  constructor(
    public dialogRef: MatDialogRef<AddquantitydialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itemId: number }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    if (this.quantityToAdd > 0) {
      this.dialogRef.close({ quantityToAdd: this.quantityToAdd });
    }
  }
}
