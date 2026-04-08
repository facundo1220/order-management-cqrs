import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderRead,
  OrderReadDocument,
} from '../../../models/read-models/order-read.schema';
import { ProductAddedEvent } from '../impl/product-added.event';

@EventsHandler(ProductAddedEvent)
export class ProductAddedProjection implements IEventHandler<ProductAddedEvent> {
  constructor(
    @InjectModel(OrderRead.name)
    private readonly orderReadModel: Model<OrderReadDocument>,
  ) {}

  async handle(event: ProductAddedEvent): Promise<void> {
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
