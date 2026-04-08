import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderRead,
  OrderReadDocument,
} from '../../read-models/order-read.schema';
import { GetOrderByIdQuery } from '../impl/get-order-by-id.query';

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdHandler implements IQueryHandler<GetOrderByIdQuery> {
  constructor(
    @InjectModel(OrderRead.name)
    private readonly orderReadModel: Model<OrderReadDocument>,
  ) {}

  async execute(query: GetOrderByIdQuery): Promise<unknown> {
    const order = await this.orderReadModel
      .findOne({ orderId: query.orderId })
      .lean();
    if (!order) throw new NotFoundException(`Order ${query.orderId} not found`);
    return order;
  }
}
