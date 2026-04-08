import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddProductHandler } from './commands/handlers/add-product.handler';
import { ChangeOrderStatusHandler } from './commands/handlers/change-order-status.handler';
import { CreateOrderHandler } from './commands/handlers/create-order.handler';
import { RemoveProductHandler } from './commands/handlers/remove-product.handler';
import { OrdersCommandController } from './controllers/orders-command.controller';
import { OrdersQueryController } from './controllers/orders-query.controller';
import { OrderCreatedProjection } from './events/handlers/order-created.handler';
import { OrderStatusChangedProjection } from './events/handlers/order-status-changed.handler';
import { ProductAddedProjection } from './events/handlers/product-added.handler';
import { ProductRemovedProjection } from './events/handlers/product-removed.handler';
import { GetOrderByIdHandler } from './queries/handlers/get-order-by-id.handler';
import { GetSalesSummaryHandler } from './queries/handlers/get-sales-summary.handler';
import { ListOrdersByCustomerHandler } from './queries/handlers/list-orders-by-customer.handler';
import { ListOrdersByStatusHandler } from './queries/handlers/list-orders-by-status.handler';
import { OrderRead, OrderReadSchema } from './read-models/order-read.schema';
import { OrderItem } from './write-models/order-item.entity';
import { Order } from './write-models/order.entity';

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
