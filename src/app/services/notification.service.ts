import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})

//сервис отвечает за сообщения подтверждающие наши действия
export class NotificationService {
  constructor(private snackbar: MatSnackBar) {
  }

  public showSnackBar(message: string): void {
    this.snackbar.open(message, null!, {duration: 2000});
  }
}
