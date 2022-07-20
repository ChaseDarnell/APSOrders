import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrder, Order } from '../order.model';
import { OrderService } from '../service/order.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { StatusO } from 'app/entities/enumerations/status-o.model';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;
  statusOValues = Object.keys(StatusO);

  customersSharedCollection: ICustomer[] = [];

  editForm = this.fb.group({
    id: [],
    driver: [null, [Validators.required]],
    pickUpDate: [null, [Validators.required]],
    repairDate: [],
    deliveryDate: [],
    rOrderNum: [null, [Validators.required]],
    invOrderNum: [null, []],
    statusO: [],
    notes: [],
    customer: [],
  });

  constructor(
    protected orderService: OrderService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      if (order.id === undefined) {
        const today = dayjs().startOf('day');
        order.pickUpDate = today;
        order.repairDate = today;
        order.deliveryDate = today;
      }

      this.updateForm(order);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.createFromForm();
    if (order.id !== undefined) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  trackCustomerById(_index: number, item: ICustomer): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
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

  protected updateForm(order: IOrder): void {
    this.editForm.patchValue({
      id: order.id,
      driver: order.driver,
      pickUpDate: order.pickUpDate ? order.pickUpDate.format(DATE_TIME_FORMAT) : null,
      repairDate: order.repairDate ? order.repairDate.format(DATE_TIME_FORMAT) : null,
      deliveryDate: order.deliveryDate ? order.deliveryDate.format(DATE_TIME_FORMAT) : null,
      rOrderNum: order.rOrderNum,
      invOrderNum: order.invOrderNum,
      statusO: order.statusO,
      notes: order.notes,
      customer: order.customer,
    });

    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing(this.customersSharedCollection, order.customer);
  }

  protected loadRelationshipsOptions(): void {
    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing(customers, this.editForm.get('customer')!.value)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      id: this.editForm.get(['id'])!.value,
      driver: this.editForm.get(['driver'])!.value,
      pickUpDate: this.editForm.get(['pickUpDate'])!.value ? dayjs(this.editForm.get(['pickUpDate'])!.value, DATE_TIME_FORMAT) : undefined,
      repairDate: this.editForm.get(['repairDate'])!.value ? dayjs(this.editForm.get(['repairDate'])!.value, DATE_TIME_FORMAT) : undefined,
      deliveryDate: this.editForm.get(['deliveryDate'])!.value
        ? dayjs(this.editForm.get(['deliveryDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      rOrderNum: this.editForm.get(['rOrderNum'])!.value,
      invOrderNum: this.editForm.get(['invOrderNum'])!.value,
      statusO: this.editForm.get(['statusO'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      customer: this.editForm.get(['customer'])!.value,
    };
  }
}
