import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPiece } from '../piece.model';
import { PieceService } from '../service/piece.service';

@Component({
  templateUrl: './piece-delete-dialog.component.html',
})
export class PieceDeleteDialogComponent {
  piece?: IPiece;

  constructor(protected pieceService: PieceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pieceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}