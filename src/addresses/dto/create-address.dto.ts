import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  phone: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  zip_code: string;

  @IsOptional()
  @IsBoolean()
  is_default: boolean;

  @IsUUID()
  user_id: string;
}
