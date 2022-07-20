import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PieceService } from '../service/piece.service';
import { IPiece, Piece } from '../piece.model';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

import { PieceUpdateComponent } from './piece-update.component';

describe('Piece Management Update Component', () => {
  let comp: PieceUpdateComponent;
  let fixture: ComponentFixture<PieceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pieceService: PieceService;
  let orderService: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PieceUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PieceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PieceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pieceService = TestBed.inject(PieceService);
    orderService = TestBed.inject(OrderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Order query and add missing value', () => {
      const piece: IPiece = { id: 456 };
      const order: IOrder = { id: 67107 };
      piece.order = order;
      const order: IOrder = { id: 43535 };
      piece.order = order;

      const orderCollection: IOrder[] = [{ id: 10581 }];
      jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
      const additionalOrders = [order, order];
      const expectedCollection: IOrder[] = [...additionalOrders, ...orderCollection];
      jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ piece });
      comp.ngOnInit();

      expect(orderService.query).toHaveBeenCalled();
      expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(orderCollection, ...additionalOrders);
      expect(comp.ordersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const piece: IPiece = { id: 456 };
      const order: IOrder = { id: 74901 };
      piece.order = order;
      const order: IOrder = { id: 10865 };
      piece.order = order;

      activatedRoute.data = of({ piece });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(piece));
      expect(comp.ordersSharedCollection).toContain(order);
      expect(comp.ordersSharedCollection).toContain(order);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Piece>>();
      const piece = { id: 123 };
      jest.spyOn(pieceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ piece });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: piece }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(pieceService.update).toHaveBeenCalledWith(piece);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Piece>>();
      const piece = new Piece();
      jest.spyOn(pieceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ piece });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: piece }));
      saveSubject.complete();

      // THEN
      expect(pieceService.create).toHaveBeenCalledWith(piece);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Piece>>();
      const piece = { id: 123 };
      jest.spyOn(pieceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ piece });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pieceService.update).toHaveBeenCalledWith(piece);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackOrderById', () => {
      it('Should return tracked Order primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOrderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
