import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPiece, getPieceIdentifier } from '../piece.model';

export type EntityResponseType = HttpResponse<IPiece>;
export type EntityArrayResponseType = HttpResponse<IPiece[]>;

@Injectable({ providedIn: 'root' })
export class PieceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pieces');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(piece: IPiece): Observable<EntityResponseType> {
    return this.http.post<IPiece>(this.resourceUrl, piece, { observe: 'response' });
  }

  update(piece: IPiece): Observable<EntityResponseType> {
    return this.http.put<IPiece>(`${this.resourceUrl}/${getPieceIdentifier(piece) as number}`, piece, { observe: 'response' });
  }

  partialUpdate(piece: IPiece): Observable<EntityResponseType> {
    return this.http.patch<IPiece>(`${this.resourceUrl}/${getPieceIdentifier(piece) as number}`, piece, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPiece>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPiece[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPieceToCollectionIfMissing(pieceCollection: IPiece[], ...piecesToCheck: (IPiece | null | undefined)[]): IPiece[] {
    const pieces: IPiece[] = piecesToCheck.filter(isPresent);
    if (pieces.length > 0) {
      const pieceCollectionIdentifiers = pieceCollection.map(pieceItem => getPieceIdentifier(pieceItem)!);
      const piecesToAdd = pieces.filter(pieceItem => {
        const pieceIdentifier = getPieceIdentifier(pieceItem);
        if (pieceIdentifier == null || pieceCollectionIdentifiers.includes(pieceIdentifier)) {
          return false;
        }
        pieceCollectionIdentifiers.push(pieceIdentifier);
        return true;
      });
      return [...piecesToAdd, ...pieceCollection];
    }
    return pieceCollection;
  }
}
