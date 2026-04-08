import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderRead,
  OrderReadDocument,
} from '../../read-models/order-read.schema';
import { ListOrdersByStatusQuery } from '../impl/list-orders-by-status.query';

@QueryHandler(ListOrdersByStatusQuery)
export class ListOrdersByStatusHandler implements IQueryHandler<ListOrdersByStatusQuery> {
  constructor(
    @InjectModel(OrderRead.name)
    private readonly orderReadModel: Model<OrderReadDocument>,
  ) {}

  async execute(query: ListOrdersByStatusQuery): Promise<OrderReadDocument[]> {
    return this.orderReadModel
      .find({ status: query.status })
      .lean() as unknown as OrderReadDocument[];
  }
}
