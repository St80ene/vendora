import { Injectable } from '@nestjs/common';
import { CreatePromoCodeDto } from './dto/create-promo_code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo_code.dto';

@Injectable()
export class PromoCodesService {
  create(createPromoCodeDto: CreatePromoCodeDto) {
    return 'This action adds a new promoCode';
  }

  findAll() {
    return `This action returns all promoCodes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} promoCode`;
  }

  update(id: number, updatePromoCodeDto: UpdatePromoCodeDto) {
    return `This action updates a #${id} promoCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} promoCode`;
  }
}
