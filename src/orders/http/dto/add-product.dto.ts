import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class AddProductDto {
  @ApiProperty({ example: 'prod-002' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'Wireless Mouse' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @IsPositive()
  unitPrice: number;
}
