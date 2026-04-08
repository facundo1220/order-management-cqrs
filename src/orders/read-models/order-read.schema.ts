import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderReadDocument = OrderRead & Document;

@Schema({ _id: false })
export class OrderItemRead {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  subtotal: number;
}
export const OrderItemReadSchema = SchemaFactory.createForClass(OrderItemRead);

@Schema({ collection: 'orders', timestamps: true })
export class OrderRead {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  status: string;

  @Prop({ type: [OrderItemReadSchema], default: [] })
  items: OrderItemRead[];

  @Prop({ required: true })
  total: number;
}
export const OrderReadSchema = SchemaFactory.createForClass(OrderRead);

// Index for fast lookups
OrderReadSchema.index({ orderId: 1 }, { unique: true });
OrderReadSchema.index({ customerId: 1 });
OrderReadSchema.index({ status: 1 });
