import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import {
  ApiResponse,
  successResponse,
  errorResponse,
} from 'src/utils/response.utils';

@Injectable()
export class AddressesService {
  async create(
    createAddressDto: CreateAddressDto
  ): Promise<ApiResponse<Address>> {
    try {
      const address = Address.create(createAddressDto);
      await address.save();
      return successResponse('Address created successfully', address);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error creating address', error)
      );
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    user_id,
  }): Promise<ApiResponse<{ addresses: Address[]; total: number }>> {
    try {
      const pageNumber = page || 1;
      const skip = (pageNumber - 1) * limit;

      const [addresses, total] = await Address.findAndCount({
        where: { user: { id: user_id } },
        take: limit,
        skip,
        relations: { user: true },
      });

      return successResponse('Addresses retrieved successfully', {
        addresses,
        total,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching addresses', error)
      );
    }
  }

  async findOne(id: string): Promise<ApiResponse<Address>> {
    try {
      const address = await Address.findOne({
        where: { id },
        relations: { user: true },
      });
      if (!address) {
        throw new NotFoundException(errorResponse('Address not found'));
      }
      return successResponse('Address retrieved successfully', address);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching address', error)
      );
    }
  }

  async findById(id: string): Promise<ApiResponse<Address>> {
    try {
      const address = await Address.findOne({ where: { id } });
      if (!address) {
        throw new NotFoundException(errorResponse('Address not found'));
      }
      return successResponse('Address retrieved successfully', address);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error finding address by ID', error)
      );
    }
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto
  ): Promise<ApiResponse<Address>> {
    try {
      const address = await this.findById(id);
      Object.assign(address.data, updateAddressDto);
      await address.data.save();
      return successResponse('Address updated successfully', address.data);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error updating address', error)
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const address = await Address.findOne({ where: { id } });
      if (!address) {
        throw new NotFoundException(errorResponse('Address not found'));
      }

      await address.remove();
      return successResponse('Address successfully deleted', { deleted: true });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error deleting address', error)
      );
    }
  }
}
