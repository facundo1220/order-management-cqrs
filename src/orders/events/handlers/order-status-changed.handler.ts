import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderRead,
  OrderReadDocument,
} from '../../read-models/order-read.schema';
import { OrderStatusChangedEvent } from '../impl/order-status-changed.event';

@EventsHandler(OrderStatusChangedEvent)
export class OrderStatusChangedProjection implements IEventHandler<OrderStatusChangedEvent> {
  constructor(
    @InjectModel(OrderRead.name)
    private readonly orderReadModel: Model<OrderReadDocument>,
  ) {}

  async handle(event: OrderStatusChangedEvent): Promise<void> {
    const { orderId, newStatus } = event;
    await this.orderReadModel.updateOne(
      { orderId },
      { $set: { status: newStatus } },
    );
  }
}
