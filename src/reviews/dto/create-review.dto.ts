import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReviewRating } from '../enums/review-rating.enum';

export class CreateReviewDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  product_id: string;

  @IsEnum(ReviewRating)
  rating: ReviewRating;

  @IsString()
  @IsOptional()
  comment?: string;
}
