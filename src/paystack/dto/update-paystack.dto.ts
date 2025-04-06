import { PartialType } from '@nestjs/swagger';
import { CreatePaystackDto } from './create-paystack.dto';

export class UpdatePaystackDto extends PartialType(CreatePaystackDto) {}
