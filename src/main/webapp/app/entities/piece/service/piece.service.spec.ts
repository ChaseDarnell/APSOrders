import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { StatusP } from 'app/entities/enumerations/status-p.model';
import { IPiece, Piece } from '../piece.model';

import { PieceService } from './piece.service';

describe('Piece Service', () => {
  let service: PieceService;
  let httpMock: HttpTestingController;
  let elemDefault: IPiece;
  let expectedResult: IPiece | IPiece[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PieceService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      serial: 'AAAAAAA',
      model: 'AAAAAAA',
      desc: 'AAAAAAA',
      manu: 'AAAAAAA',
      notes: 'AAAAAAA',
      statusP: StatusP.TBR,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Piece', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Piece()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Piece', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          serial: 'BBBBBB',
          model: 'BBBBBB',
          desc: 'BBBBBB',
          manu: 'BBBBBB',
          notes: 'BBBBBB',
          statusP: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Piece', () => {
      const patchObject = Object.assign(
        {
          model: 'BBBBBB',
          manu: 'BBBBBB',
          notes: 'BBBBBB',
          statusP: 'BBBBBB',
        },
        new Piece()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Piece', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          serial: 'BBBBBB',
          model: 'BBBBBB',
          desc: 'BBBBBB',
          manu: 'BBBBBB',
          notes: 'BBBBBB',
          statusP: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Piece', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPieceToCollectionIfMissing', () => {
      it('should add a Piece to an empty array', () => {
        const piece: IPiece = { id: 123 };
        expectedResult = service.addPieceToCollectionIfMissing([], piece);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(piece);
      });

      it('should not add a Piece to an array that contains it', () => {
        const piece: IPiece = { id: 123 };
        const pieceCollection: IPiece[] = [
          {
            ...piece,
          },
          { id: 456 },
        ];
        expectedResult = service.addPieceToCollectionIfMissing(pieceCollection, piece);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Piece to an array that doesn't contain it", () => {
        const piece: IPiece = { id: 123 };
        const pieceCollection: IPiece[] = [{ id: 456 }];
        expectedResult = service.addPieceToCollectionIfMissing(pieceCollection, piece);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(piece);
      });

      it('should add only unique Piece to an array', () => {
        const pieceArray: IPiece[] = [{ id: 123 }, { id: 456 }, { id: 7581 }];
        const pieceCollection: IPiece[] = [{ id: 123 }];
        expectedResult = service.addPieceToCollectionIfMissing(pieceCollection, ...pieceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const piece: IPiece = { id: 123 };
        const piece2: IPiece = { id: 456 };
        expectedResult = service.addPieceToCollectionIfMissing([], piece, piece2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(piece);
        expect(expectedResult).toContain(piece2);
      });

      it('should accept null and undefined values', () => {
        const piece: IPiece = { id: 123 };
        expectedResult = service.addPieceToCollectionIfMissing([], null, piece, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(piece);
      });

      it('should return initial array if no Piece is added', () => {
        const pieceCollection: IPiece[] = [{ id: 123 }];
        expectedResult = service.addPieceToCollectionIfMissing(pieceCollection, undefined, null);
        expect(expectedResult).toEqual(pieceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
