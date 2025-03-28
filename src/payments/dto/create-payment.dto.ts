import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @IsUUID()
  order_id: string;
}
