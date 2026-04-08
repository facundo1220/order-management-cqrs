import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddProductHandler } from './application/commands/handlers/add-product.handler';
import { ChangeOrderStatusHandler } from './application/commands/handlers/change-order-status.handler';
import { CreateOrderHandler } from './application/commands/handlers/create-order.handler';
import { RemoveProductHandler } from './application/commands/handlers/remove-product.handler';
import { OrdersCommandController } from './http/controllers/orders-command.controller';
import { OrdersQueryController } from './http/controllers/orders-query.controller';
import { OrderCreatedProjection } from './application/events/handlers/order-created.handler';
import { OrderStatusChangedProjection } from './application/events/handlers/order-status-changed.handler';
import { ProductAddedProjection } from './application/events/handlers/product-added.handler';
import { ProductRemovedProjection } from './application/events/handlers/product-removed.handler';
import { GetOrderByIdHandler } from './application/queries/handlers/get-order-by-id.handler';
import { GetSalesSummaryHandler } from './application/queries/handlers/get-sales-summary.handler';
import { ListOrdersByCustomerHandler } from './application/queries/handlers/list-orders-by-customer.handler';
import { ListOrdersByStatusHandler } from './application/queries/handlers/list-orders-by-status.handler';
import {
  OrderRead,
  OrderReadSchema,
} from './models/read-models/order-read.schema';
import { OrderItem } from './models/write-models/order-item.entity';
import { Order } from './models/write-models/order.entity';

const CommandHandlers = [
  CreateOrderHandler,
  ChangeOrderStatusHandler,
  AddProductHandler,
  RemoveProductHandler,
];

const QueryHandlers = [
  GetOrderByIdHandler,
  ListOrdersByCustomerHandler,
  ListOrdersByStatusHandler,
  GetSalesSummaryHandler,
];

const EventHandlers = [
  OrderCreatedProjection,
  OrderStatusChangedProjection,
  ProductAddedProjection,
  ProductRemovedProjection,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
    MongooseModule.forFeature([
      { name: OrderRead.name, schema: OrderReadSchema },
    ]),
  ],
  controllers: [OrdersCommandController, OrdersQueryController],
  providers: [...CommandHandlers, ...QueryHandlers, ...EventHandlers],
})
export class OrdersModule {}
