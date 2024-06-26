import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../../../shared/company.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InviteSuccessComponent } from '../invite-success/invite-success.component';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
})
export class AddEmployeeComponent {
  constructor(
    public DialogRef: MatDialogRef<AddEmployeeComponent>,
    private companyService: CompanyService,
    public dialog: MatDialog,

  ){}

  email:string='';
  loading: boolean = false;

  closeDialog() {
    this.DialogRef.close();
  }

  addEmployee() {
    this.loading = true;
    if(!this.email){
      alert("Please enter a valid email");
      this.loading = false;
    }
    else{
      this.companyService.addEmployee(this.email).subscribe({
        next: (response) => {
          this.closeDialog();
        },
        error: (err: HttpErrorResponse) => {
          alert("Please enter an existing email");
        },
        complete: () => {
          this.loading = false;
          const dialogRef = this.dialog.open(InviteSuccessComponent);
        }
      });
    }
  } 
}