import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ProductStatus } from '../enums/product-status.enum';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsInt()
  stock: number;

  @IsUUID()
  category_id: string;

  @IsUUID()
  user_id: string;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  discount_value?: number;

  @IsOptional()
  @IsEnum(['percentage', 'fixed'], {
    message: 'discount_type must be either percentage or fixed',
  })
  discount_type?: 'percentage' | 'fixed';

  @IsOptional()
  @IsDate()
  discount_expires_at?: Date;
}
