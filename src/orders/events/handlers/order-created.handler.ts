import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderRead,
  OrderReadDocument,
} from '../../read-models/order-read.schema';
import { OrderCreatedEvent } from '../impl/order-created.event';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedProjection implements IEventHandler<OrderCreatedEvent> {
  constructor(
    @InjectModel(OrderRead.name)
    private readonly orderReadModel: Model<OrderReadDocument>,
  ) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    const { orderId, customerId, date, items, status } = event;

    const mappedItems = items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      subtotal: item.quantity * Number(item.unitPrice),
    }));

    const total = mappedItems.reduce((sum, i) => sum + i.subtotal, 0);

    await this.orderReadModel.create({
      orderId,
      customerId,
      date,
      status,
      items: mappedItems,
      total,
    });
  }
}
