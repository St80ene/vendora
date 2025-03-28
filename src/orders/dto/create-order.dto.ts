import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';
import { CreateOrderItemDto } from 'src/orderitems/dto/create-orderitem.dto';

export class CreateOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsNumber()
  total?: number; // Auto-calculated from order_items

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  order_items: CreateOrderItemDto[];
}
