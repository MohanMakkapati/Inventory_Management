import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule,NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { InventoryService } from '../../../services/inventory.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-issueitem-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule,MatSnackBarModule, MatSelectModule],
  templateUrl: './issueitem-dialog.component.html',
  styleUrl: './issueitem-dialog.component.css'
})
export class IssueitemDialogComponent {
  departments: any[] = [];
  departmentId: number | null = null;
  quantity: number | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<IssueitemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inventoryId: number },
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.inventoryService.getDepartments().subscribe({
      next: (data) => (this.departments = data),
      error: () => (this.errorMessage = 'Failed to load departments')
    });
  }

  issue(form: NgForm): void {
    if (this.data.inventoryId && this.departmentId && this.quantity && this.quantity > 0) {
      this.inventoryService.issueInventory(this.data.inventoryId, this.departmentId, this.quantity).subscribe({
        next: (res: any) => {
          this.successMessage = res.message;
          this.errorMessage = '';
          this.snackBar.open(
            `${this.successMessage}`,
            'Close',
            {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
            this.dialogRef.close(true);
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Failed to issue inventory';
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'All fields are required';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
