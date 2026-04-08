import { OrderStatus } from '../../../common/enums/order-status.enum';

export class ChangeOrderStatusCommand {
  constructor(
    public readonly orderId: string,
    public readonly newStatus: OrderStatus,
  ) {}
}
