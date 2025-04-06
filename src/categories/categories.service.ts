import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from 'src/utils/response.utils';
import { Category } from './entities/category.entity';
import { isValidUrl } from 'src/utils/general.utils';

@Injectable()
export class CategoriesService {
  async create(createCategoryDto): Promise<ApiResponse<Category>> {
    try {
      if (!createCategoryDto.name || createCategoryDto.name.trim().length < 3) {
        throw new BadRequestException(
          'Category name is required and should be at least 3 characters long.'
        );
      }

      const existingCategory = await Category.findOne({
        where: { name: createCategoryDto.name },
      });
      if (existingCategory) {
        throw new BadRequestException(
          'Category with this name already exists.'
        );
      }
      if (
        createCategoryDto.image_url &&
        !isValidUrl(createCategoryDto.image_url)
      ) {
        throw new BadRequestException('Invalid image URL provided.');
      }
      const category = Category.create(createCategoryDto);

      await category.save();

      return successResponse('Category created successfully', category);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error creating category', error)
      );
    }
  }

  async findAll({
    page = 1,
    limit = 10,
  }): Promise<ApiResponse<{ categories: Category[]; total: number }>> {
    try {
      const pageNumber = page || 1;
      const skip = (pageNumber - 1) * limit;

      const [categories, total] = await Category.findAndCount({
        take: limit,
        skip,
        relations: { products: true, promo_codes: true },
      });

      return successResponse('Categories retrieved successfully', {
        categories,
        total,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching Categories', error)
      );
    }
  }

  async findById(id: string): Promise<ApiResponse<Category>> {
    try {
      const address = await Category.findOne({ where: { id } });
      if (!address) {
        throw new NotFoundException(errorResponse('Address not found'));
      }
      return successResponse('Category retrieved successfully', address);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error finding Category by ID', error)
      );
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.findById(id);
      Object.assign(category.data, updateCategoryDto);
      await category.data.save();
      return successResponse('Category updated successfully', category.data);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error updating category', error)
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const address = await Category.findOne({ where: { id } });
      if (!address) {
        throw new NotFoundException(errorResponse('Category not found'));
      }

      await address.remove();
      return successResponse('Category successfully deleted', {
        deleted: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error deleting category', error)
      );
    }
  }
}
