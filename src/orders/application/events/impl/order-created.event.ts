import { OrderStatus } from '../../../common/enums/order-status.enum';
import { OrderItem } from '../../../models/write-models/order-item.entity';

export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly date: Date,
    public readonly items: OrderItem[],
    public readonly status: OrderStatus,
  ) {}
}
