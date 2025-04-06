import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ShipmentStatus } from '../enums/shipment-status.enum';

export class CreateShipmentDto {
  @IsNumber()
  tracking_number: number;

  @IsEnum(ShipmentStatus)
  status: string;

  @IsString()
  courier: string;

  @IsString()
  label_url: string;

  @IsOptional()
  shipped_at?: Date;

  @IsOptional()
  delivered_at?: Date;

  @IsUUID()
  order_id: string;

  @IsUUID()
  address_id: string;
}
