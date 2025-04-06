import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PromoType } from '../enums/promo_code.enum';

export class CreatePromoCodeDto {
  @IsString()
  code: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  value: number;

  @IsEnum(PromoType)
  type: PromoType;

  @IsOptional()
  @IsString()
  applies_to_product_id: string;

  @IsOptional()
  @IsString()
  applies_to_category_id: string;

  @IsOptional()
  @IsString()
  is_active: string;

  @IsOptional()
  @IsDate()
  expires_at: Date;
}
