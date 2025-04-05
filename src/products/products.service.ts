import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from 'src/utils/response.utils';

@Injectable()
export class ProductsService {
  constructor() {}

  async create(
    createProductDto: CreateProductDto
  ): Promise<ApiResponse<Product>> {
    try {
      const product = Product.create(createProductDto);
      await product.save();
      return successResponse('User created successfully', product);
    } catch (error) {
      throw new InternalServerErrorException('Error creating product');
    }
  }

  async findAll({
    page = 1,
    limit = 10,
  }): Promise<ApiResponse<{ products: Product[]; total: number }>> {
    try {
      const pageNumber = page || 1;
      const skip = (pageNumber - 1) * limit;

      const [products, total] = await Product.findAndCount({
        take: limit,
        skip,
      });

      return successResponse('Products retrieved successfully', {
        products,
        total,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching products');
    }
  }

  async findOne(id: string): Promise<ApiResponse<Product>> {
    try {
      const product = await Product.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(errorResponse('product not found'));
      }
      return successResponse('Product retrieved successfully', product);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching product', error)
      );
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<ApiResponse<Product>> {
    try {
      const product = await this.findOne(id);
      Object.assign(product.data, updateProductDto);
      await product.data.save();
      return successResponse('User updated successfully', product.data);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error updating user', error)
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const user = await Product.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(errorResponse('Product not found'));
      }

      await user.remove();
      return successResponse('Product successfully deleted', { deleted: true });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error deleting product', error)
      );
    }
  }
}
