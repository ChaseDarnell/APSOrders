import { IOrder } from 'app/entities/order/order.model';
import { StatusP } from 'app/entities/enumerations/status-p.model';

export interface IPiece {
  id?: number;
  serial?: string;
  model?: string;
  desc?: string | null;
  manu?: string;
  notes?: string | null;
  statusP?: StatusP | null;
  order?: IOrder | null;
  order?: IOrder | null;
}

export class Piece implements IPiece {
  constructor(
    public id?: number,
    public serial?: string,
    public model?: string,
    public desc?: string | null,
    public manu?: string,
    public notes?: string | null,
    public statusP?: StatusP | null,
    public order?: IOrder | null,
    public order?: IOrder | null
  ) {}
}

export function getPieceIdentifier(piece: IPiece): number | undefined {
  return piece.id;
}
