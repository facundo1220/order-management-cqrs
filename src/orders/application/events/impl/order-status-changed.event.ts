import { OrderStatus } from '../../../common/enums/order-status.enum';

export class OrderStatusChangedEvent {
  constructor(
    public readonly orderId: string,
    public readonly newStatus: OrderStatus,
  ) {}
}
