import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { GetOrderByIdQuery } from '../../application/queries/impl/get-order-by-id.query';
import { GetSalesSummaryQuery } from '../../application/queries/impl/get-sales-summary.query';
import { ListOrdersByCustomerQuery } from '../../application/queries/impl/list-orders-by-customer.query';
import { ListOrdersByStatusQuery } from '../../application/queries/impl/list-orders-by-status.query';

@ApiTags('Queries')
@Controller('orders')
export class OrdersQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('summary/sales')
  @ApiOperation({
    summary:
      'Resumen de ventas (total pedidos, ingresos, productos más solicitados)',
  })
  getSalesSummary() {
    return this.queryBus.execute(new GetSalesSummaryQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar pedido por ID' })
  getOrderById(@Param('id') id: string) {
    return this.queryBus.execute(new GetOrderByIdQuery(id));
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos por cliente o por estado' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  listOrders(
    @Query('customerId') customerId?: string,
    @Query('status') status?: OrderStatus,
  ) {
    if (customerId) {
      return this.queryBus.execute(new ListOrdersByCustomerQuery(customerId));
    }
    if (status) {
      return this.queryBus.execute(new ListOrdersByStatusQuery(status));
    }
    return this.queryBus.execute(
      new ListOrdersByStatusQuery(OrderStatus.CREATED),
    );
  }
}
