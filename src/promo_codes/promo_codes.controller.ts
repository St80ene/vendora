import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PromoCodesService } from './promo_codes.service';
import { CreatePromoCodeDto } from './dto/create-promo_code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo_code.dto';

@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Post()
  create(@Body() createPromoCodeDto: CreatePromoCodeDto) {
    return this.promoCodesService.create(createPromoCodeDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.promoCodesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promoCodesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromoCodeDto: UpdatePromoCodeDto
  ) {
    return this.promoCodesService.update(id, updatePromoCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promoCodesService.remove(id);
  }

  @Get('validate/:code')
  async validatePromoCode(@Param('code') code: string) {
    return this.promoCodesService.validatePromoCode(code);
  }
}
