import { PartialType } from '@nestjs/swagger';
import { CreatePromoCodeDto } from './create-promo_code.dto';

export class UpdatePromoCodeDto extends PartialType(CreatePromoCodeDto) {}
