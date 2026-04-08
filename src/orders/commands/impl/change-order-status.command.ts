import { OrderStatus } from '../../enums/order-status.enum';

export class ChangeOrderStatusCommand {
  constructor(
    public readonly orderId: string,
    public readonly newStatus: OrderStatus,
  ) {}
}
