import dayjs from 'dayjs/esm';
import { IPiece } from 'app/entities/piece/piece.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { StatusO } from 'app/entities/enumerations/status-o.model';

export interface IOrder {
  id?: number;
  driver?: string;
  pickUpDate?: dayjs.Dayjs;
  repairDate?: dayjs.Dayjs | null;
  deliveryDate?: dayjs.Dayjs | null;
  rOrderNum?: string;
  invOrderNum?: string | null;
  statusO?: StatusO | null;
  notes?: string | null;
  pieces?: IPiece[] | null;
  customer?: ICustomer | null;
  pieces?: IPiece[] | null;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public driver?: string,
    public pickUpDate?: dayjs.Dayjs,
    public repairDate?: dayjs.Dayjs | null,
    public deliveryDate?: dayjs.Dayjs | null,
    public rOrderNum?: string,
    public invOrderNum?: string | null,
    public statusO?: StatusO | null,
    public notes?: string | null,
    public pieces?: IPiece[] | null,
    public customer?: ICustomer | null,
    public pieces?: IPiece[] | null
  ) {}
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
