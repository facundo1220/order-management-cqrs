import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../enums/order-status.enum';
import { ProductRemovedEvent } from '../../events/impl/product-removed.event';
import { OrderItem } from '../../write-models/order-item.entity';
import { Order } from '../../write-models/order.entity';
import { RemoveProductCommand } from '../impl/remove-product.command';

@CommandHandler(RemoveProductCommand)
export class RemoveProductHandler implements ICommandHandler<RemoveProductCommand> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveProductCommand): Promise<void> {
    const { orderId, productId } = command;

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    if (
      order.status === OrderStatus.SHIPPED ||
      order.status === OrderStatus.DELIVERED
    ) {
      throw new BadRequestException(
        'Cannot remove products from a shipped or delivered order',
      );
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot modify a cancelled order');
    }

    const item = await this.itemRepo.findOne({ where: { orderId, productId } });
    if (!item) {
      throw new NotFoundException(
        `Product ${productId} not found in order ${orderId}`,
      );
    }

    await this.itemRepo.delete({ orderId, productId });

    const updatedOrder = await this.orderRepo.findOne({
      where: { id: orderId },
    });
    this.eventBus.publish(
      new ProductRemovedEvent(orderId, updatedOrder!.items),
    );
  }
}
