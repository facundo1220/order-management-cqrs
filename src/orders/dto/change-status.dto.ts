import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class ChangeStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PAID })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
