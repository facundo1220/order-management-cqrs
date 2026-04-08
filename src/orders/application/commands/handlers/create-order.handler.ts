import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { OrderCreatedEvent } from '../../events/impl/order-created.event';
import { OrderItem } from '../../../models/write-models/order-item.entity';
import { Order } from '../../../models/write-models/order.entity';
import { CreateOrderCommand } from '../impl/create-order.command';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateOrderCommand): Promise<void> {
    const { orderId, customerId, date, items } = command;

    const order = this.orderRepo.create({
      id: orderId,
      customerId,
      date,
      status: OrderStatus.CREATED,
      items: items.map((item) => {
        const orderItem = new OrderItem();
        orderItem.id = randomUUID();
        orderItem.orderId = orderId;
        orderItem.productId = item.productId;
        orderItem.productName = item.productName;
        orderItem.quantity = item.quantity;
        orderItem.unitPrice = item.unitPrice;
        return orderItem;
      }),
    });

    await this.orderRepo.save(order);

    this.eventBus.publish(
      new OrderCreatedEvent(
        orderId,
        customerId,
        date,
        order.items,
        OrderStatus.CREATED,
      ),
    );
  }
}
