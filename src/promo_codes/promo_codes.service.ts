import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePromoCodeDto } from './dto/update-promo_code.dto';
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from 'src/utils/response.utils';
import { PromoCode } from './entities/promo_code.entity';

@Injectable()
export class PromoCodesService {
  async create(createPromoCodeDto): Promise<ApiResponse<PromoCode>> {
    try {
      // Check if the promo code is unique
      const isUnique = await this.isPromoCodeUnique(createPromoCodeDto.code);
      if (!isUnique) {
        throw new ConflictException(errorResponse('Promo code already exists'));
      }

      const promoCode = PromoCode.create(createPromoCodeDto);
      await promoCode.save();
      return successResponse('Promo code created successfully', promoCode);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error creating promo code', error)
      );
    }
  }

  async findAll({
    page = 1,
    limit = 10,
  }): Promise<ApiResponse<{ promoCodes: PromoCode[]; total: number }>> {
    try {
      const skip = (page - 1) * limit;

      const [promoCodes, total] = await PromoCode.findAndCount({
        take: limit,
        skip,
      });

      return successResponse('Promo codes retrieved successfully', {
        promoCodes,
        total,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching promo codes', error)
      );
    }
  }

  // Find a promo code by its ID
  async findOne(id: string): Promise<ApiResponse<PromoCode>> {
    try {
      const promoCode = await PromoCode.findOne({ where: { id } });
      if (!promoCode) {
        throw new NotFoundException(errorResponse('Promo code not found'));
      }
      return successResponse('Promo code retrieved successfully', promoCode);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error finding promo code by ID', error)
      );
    }
  }

  // Update a promo code
  async update(
    id: string,
    updatePromoCodeDto: UpdatePromoCodeDto
  ): Promise<ApiResponse<PromoCode>> {
    try {
      // If the code is being changed, check if the new code is unique
      if (updatePromoCodeDto.code) {
        const isUnique = await this.isPromoCodeUnique(updatePromoCodeDto.code);
        if (!isUnique) {
          throw new ConflictException(
            errorResponse('Promo code already exists')
          );
        }
      }

      const promoCode = await this.findOne(id);
      Object.assign(promoCode.data, updatePromoCodeDto);
      await promoCode.data.save();
      return successResponse('Promo code updated successfully', promoCode.data);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error updating promo code', error)
      );
    }
  }

  // Delete a promo code
  async remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const promoCode = await PromoCode.findOne({ where: { id } });
      if (!promoCode) {
        throw new NotFoundException(errorResponse('Promo code not found'));
      }

      await promoCode.remove();
      return successResponse('Promo code successfully deleted', {
        deleted: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error deleting promo code', error)
      );
    }
  }

  // Validate a promo code (this could check if a promo code is still valid or applied)
  async validatePromoCode(code: string): Promise<ApiResponse<boolean>> {
    try {
      const promoCode = await PromoCode.findOne({ where: { code } });
      if (!promoCode || !promoCode.is_active) {
        throw new NotFoundException(
          errorResponse('Invalid, inactive or expired promo code')
        );
      }

      return successResponse('Promo code is valid', true);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error validating promo code', error)
      );
    }
  }

  // Check if a promo code is unique
  async isPromoCodeUnique(code: string): Promise<boolean> {
    const existingPromoCode = await PromoCode.findOne({ where: { code } });
    return !existingPromoCode;
  }
}
