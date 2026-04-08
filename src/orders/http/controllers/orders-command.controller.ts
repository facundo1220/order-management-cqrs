import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { AddProductCommand } from '../../application/commands/impl/add-product.command';
import { ChangeOrderStatusCommand } from '../../application/commands/impl/change-order-status.command';
import { CreateOrderCommand } from '../../application/commands/impl/create-order.command';
import { RemoveProductCommand } from '../../application/commands/impl/remove-product.command';
import { AddProductDto } from '../dto/add-product.dto';
import { ChangeStatusDto } from '../dto/change-status.dto';
import { CreateOrderDto } from '../dto/create-order.dto';

@ApiTags('Commands')
@Controller('orders')
export class OrdersCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  async createOrder(@Body() dto: CreateOrderDto) {
    const orderId = randomUUID();
    await this.commandBus.execute(
      new CreateOrderCommand(
        orderId,
        dto.customerId,
        new Date(dto.date),
        dto.items,
      ),
    );
    return { orderId };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado del pedido' })
  async changeStatus(@Param('id') id: string, @Body() dto: ChangeStatusDto) {
    await this.commandBus.execute(new ChangeOrderStatusCommand(id, dto.status));
    return { message: `Order ${id} status updated to ${dto.status}` };
  }

  @Post(':id/products')
  @ApiOperation({ summary: 'Agregar producto al pedido' })
  async addProduct(@Param('id') id: string, @Body() dto: AddProductDto) {
    await this.commandBus.execute(
      new AddProductCommand(
        id,
        dto.productId,
        dto.productName,
        dto.quantity,
        dto.unitPrice,
      ),
    );
    return { message: 'Product added' };
  }

  @Delete(':id/products/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar producto del pedido' })
  async removeProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    await this.commandBus.execute(new RemoveProductCommand(id, productId));
    return { message: 'Product removed' };
  }
}
