import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 'prod-001' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'Laptop' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @IsPositive()
  unitPrice: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'cust-123' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
