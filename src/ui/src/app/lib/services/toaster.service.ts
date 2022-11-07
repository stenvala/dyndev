import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  texts?: any;

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string) {
    this.snackBar.open(message, 'OK!', {
      duration: 2000,
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'ERROR!', {
      panelClass: 'error',
      duration: 2000,
    });
  }
}
