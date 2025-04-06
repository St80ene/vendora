import { Module } from '@nestjs/common';
import { PromoCodesService } from './promo_codes.service';
import { PromoCodesController } from './promo_codes.controller';

@Module({
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
})
export class PromoCodesModule {}
