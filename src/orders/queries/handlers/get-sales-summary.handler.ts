import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderRead,
  OrderReadDocument,
} from '../../read-models/order-read.schema';
import { GetSalesSummaryQuery } from '../impl/get-sales-summary.query';

export interface ProductSummary {
  productId: string;
  productName: string;
  totalQuantity: number;
}

export interface SalesSummary {
  totalOrders: number;
  totalRevenue: number;
  topProducts: ProductSummary[];
}

@QueryHandler(GetSalesSummaryQuery)
export class GetSalesSummaryHandler implements IQueryHandler<GetSalesSummaryQuery> {
  constructor(
    @InjectModel(OrderRead.name)
    private readonly orderReadModel: Model<OrderReadDocument>,
  ) {}

  async execute(): Promise<SalesSummary> {
    const [countResult, revenueResult, topProducts] = await Promise.all([
      this.orderReadModel.countDocuments(),
      this.orderReadModel.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
      ]),
      this.orderReadModel.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            productName: { $first: '$items.productName' },
            totalQuantity: { $sum: '$items.quantity' },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            productId: '$_id',
            productName: 1,
            totalQuantity: 1,
          },
        },
      ]),
    ]);

    return {
      totalOrders: countResult,
      totalRevenue: revenueResult[0]?.totalRevenue ?? 0,
      topProducts,
    };
  }
}
