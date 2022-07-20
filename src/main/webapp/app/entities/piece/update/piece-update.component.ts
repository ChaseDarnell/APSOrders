import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPiece, Piece } from '../piece.model';
import { PieceService } from '../service/piece.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { StatusP } from 'app/entities/enumerations/status-p.model';

@Component({
  selector: 'jhi-piece-update',
  templateUrl: './piece-update.component.html',
})
export class PieceUpdateComponent implements OnInit {
  isSaving = false;
  statusPValues = Object.keys(StatusP);

  ordersSharedCollection: IOrder[] = [];

  editForm = this.fb.group({
    id: [],
    serial: [null, [Validators.required]],
    model: [null, [Validators.required]],
    desc: [],
    manu: [null, [Validators.required]],
    notes: [],
    statusP: [],
    orders: [],
  });

  constructor(
    protected pieceService: PieceService,
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ piece }) => {
      this.updateForm(piece);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const piece = this.createFromForm();
    if (piece.id !== undefined) {
      this.subscribeToSaveResponse(this.pieceService.update(piece));
    } else {
      this.subscribeToSaveResponse(this.pieceService.create(piece));
    }
  }

  trackOrderById(_index: number, item: IOrder): number {
    return item.id!;
  }

  getSelectedOrder(option: IOrder, selectedVals?: IOrder[]): IOrder {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPiece>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(piece: IPiece): void {
    this.editForm.patchValue({
      id: piece.id,
      serial: piece.serial,
      model: piece.model,
      desc: piece.desc,
      manu: piece.manu,
      notes: piece.notes,
      statusP: piece.statusP,
      orders: piece.orders,
    });

    this.ordersSharedCollection = this.orderService.addOrderToCollectionIfMissing(this.ordersSharedCollection, ...(piece.orders ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.orderService
      .query()
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(
        map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing(orders, ...(this.editForm.get('orders')!.value ?? [])))
      )
      .subscribe((orders: IOrder[]) => (this.ordersSharedCollection = orders));
  }

  protected createFromForm(): IPiece {
    return {
      ...new Piece(),
      id: this.editForm.get(['id'])!.value,
      serial: this.editForm.get(['serial'])!.value,
      model: this.editForm.get(['model'])!.value,
      desc: this.editForm.get(['desc'])!.value,
      manu: this.editForm.get(['manu'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      statusP: this.editForm.get(['statusP'])!.value,
      orders: this.editForm.get(['orders'])!.value,
    };
  }
}
