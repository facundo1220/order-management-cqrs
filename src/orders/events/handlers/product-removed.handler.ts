import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderRead,
  OrderReadDocument,
} from '../../read-models/order-read.schema';
import { ProductRemovedEvent } from '../impl/product-removed.event';

@EventsHandler(ProductRemovedEvent)
export class ProductRemovedProjection implements IEventHandler<ProductRemovedEvent> {
  constructor(
    @InjectModel(OrderRead.name)
    private readonly orderReadModel: Model<OrderReadDocument>,
  ) {}

  async handle(event: ProductRemovedEvent): Promise<void> {
    const { orderId, updatedItems } = event;

    const mappedItems = updatedItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      subtotal: item.quantity * Number(item.unitPrice),
    }));

    const total = mappedItems.reduce((sum, i) => sum + i.subtotal, 0);

    await this.orderReadModel.updateOne(
      { orderId },
      { $set: { items: mappedItems, total } },
    );
  }
}
