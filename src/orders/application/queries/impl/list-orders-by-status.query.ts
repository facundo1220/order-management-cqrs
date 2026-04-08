import { OrderStatus } from '../../../common/enums/order-status.enum';

export class ListOrdersByStatusQuery {
  constructor(public readonly status: OrderStatus) {}
}
