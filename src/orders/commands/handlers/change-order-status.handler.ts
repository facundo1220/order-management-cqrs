import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../enums/order-status.enum';
import { OrderStatusChangedEvent } from '../../events/impl/order-status-changed.event';
import { Order } from '../../write-models/order.entity';
import { ChangeOrderStatusCommand } from '../impl/change-order-status.command';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.CREATED]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

@CommandHandler(ChangeOrderStatusCommand)
export class ChangeOrderStatusHandler implements ICommandHandler<ChangeOrderStatusCommand> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ChangeOrderStatusCommand): Promise<void> {
    const { orderId, newStatus } = command;

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${newStatus}`,
      );
    }

    order.status = newStatus;
    await this.orderRepo.save(order);

    this.eventBus.publish(new OrderStatusChangedEvent(orderId, newStatus));
  }
}
