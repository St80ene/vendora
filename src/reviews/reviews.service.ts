import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from 'src/utils/response.utils';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  async create(createReviewDto: CreateReviewDto): Promise<ApiResponse<Review>> {
    try {
      const review = Review.create(createReviewDto);

      await review.save();

      return successResponse('Review created successfully', review);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error creating review', error)
      );
    }
  }

  async findAll({
    page = 1,
    limit = 10,
  }): Promise<ApiResponse<{ reviews: Review[]; total: number }>> {
    try {
      const pageNumber = page || 1;
      const skip = (pageNumber - 1) * limit;

      const [reviews, total] = await Review.findAndCount({
        take: limit,
        skip,
        relations: { product: true, user: true },
      });

      return successResponse('Reviews retrieved successfully', {
        reviews,
        total,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching reviews', error)
      );
    }
  }

  async findOne(id: string): Promise<ApiResponse<Review>> {
    try {
      const review = await Review.findOne({ where: { id } });
      if (!review) {
        throw new NotFoundException(errorResponse('Review not found'));
      }
      return successResponse('Review retrieved successfully', review);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error finding review by ID', error)
      );
    }
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto
  ): Promise<ApiResponse<Review>> {
    try {
      const review = await this.findOne(id);
      Object.assign(review.data, updateReviewDto);
      await review.data.save();
      return successResponse('Review updated successfully', review.data);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error updating review', error)
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const review = await Review.findOne({ where: { id } });
      if (!review) {
        throw new NotFoundException(errorResponse('Review not found'));
      }

      await review.remove();
      return successResponse('Review successfully deleted', {
        deleted: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error deleting review', error)
      );
    }
  }
}
