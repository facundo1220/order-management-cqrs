import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { OrderStatus } from '../../enums/order-status.enum';
import { ProductAddedEvent } from '../../events/impl/product-added.event';
import { OrderItem } from '../../write-models/order-item.entity';
import { Order } from '../../write-models/order.entity';
import { AddProductCommand } from '../impl/add-product.command';

@CommandHandler(AddProductCommand)
export class AddProductHandler implements ICommandHandler<AddProductCommand> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddProductCommand): Promise<void> {
    const { orderId, productId, productName, quantity, unitPrice } = command;

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    if (
      order.status === OrderStatus.SHIPPED ||
      order.status === OrderStatus.DELIVERED
    ) {
      throw new BadRequestException(
        'Cannot add products to a shipped or delivered order',
      );
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot modify a cancelled order');
    }

    const item = this.itemRepo.create({
      id: randomUUID(),
      orderId,
      productId,
      productName,
      quantity,
      unitPrice,
    });
    await this.itemRepo.save(item);

    const updatedOrder = await this.orderRepo.findOne({
      where: { id: orderId },
    });
    this.eventBus.publish(new ProductAddedEvent(orderId, updatedOrder!.items));
  }
}
