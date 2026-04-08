import { OrderItem } from '../../write-models/order-item.entity';

export class ProductAddedEvent {
  constructor(
    public readonly orderId: string,
    public readonly updatedItems: OrderItem[],
  ) {}
}
