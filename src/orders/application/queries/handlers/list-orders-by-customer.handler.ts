import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderRead,
  OrderReadDocument,
} from '../../../models/read-models/order-read.schema';
import { ListOrdersByCustomerQuery } from '../impl/list-orders-by-customer.query';

@QueryHandler(ListOrdersByCustomerQuery)
export class ListOrdersByCustomerHandler implements IQueryHandler<ListOrdersByCustomerQuery> {
  constructor(
    @InjectModel(OrderRead.name)
    private readonly orderReadModel: Model<OrderReadDocument>,
  ) {}

  async execute(
    query: ListOrdersByCustomerQuery,
  ): Promise<OrderReadDocument[]> {
    return this.orderReadModel
      .find({ customerId: query.customerId })
      .lean() as unknown as OrderReadDocument[];
  }
}
