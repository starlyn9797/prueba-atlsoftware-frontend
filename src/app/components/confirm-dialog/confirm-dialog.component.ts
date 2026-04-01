import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  readonly visible = input(false);
  readonly title = input('Confirmar');
  readonly message = input('¿Estás seguro?');
  readonly confirm = output();
  readonly cancel = output();
}
