import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  product_id: string;

  @IsUUID()
  order_id: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}
