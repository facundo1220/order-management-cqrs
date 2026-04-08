import { OrderStatus } from '../../enums/order-status.enum';

export class ListOrdersByStatusQuery {
  constructor(public readonly status: OrderStatus) {}
}
