import { OrderItem } from '../../../models/write-models/order-item.entity';

export class ProductRemovedEvent {
  constructor(
    public readonly orderId: string,
    public readonly updatedItems: OrderItem[],
  ) {}
}
