import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPiece } from '../piece.model';
import { PieceService } from '../service/piece.service';
import { PieceDeleteDialogComponent } from '../delete/piece-delete-dialog.component';

@Component({
  selector: 'jhi-piece',
  templateUrl: './piece.component.html',
})
export class PieceComponent implements OnInit {
  pieces?: IPiece[];
  isLoading = false;

  constructor(protected pieceService: PieceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.pieceService.query().subscribe({
      next: (res: HttpResponse<IPiece[]>) => {
        this.isLoading = false;
        this.pieces = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPiece): number {
    return item.id!;
  }

  delete(piece: IPiece): void {
    const modalRef = this.modalService.open(PieceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.piece = piece;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
