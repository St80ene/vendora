import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
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
}
