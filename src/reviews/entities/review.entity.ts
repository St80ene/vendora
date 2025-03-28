import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { ReviewRating } from '../enums/review-rating.enum';

@Entity({ name: 'reviews' })
@Unique(['user', 'product']) // Prevents multiple reviews per user-product pair
export class Review extends BaseEntity {
  constructor(props?: Partial<Review>) {
    super();
    props && Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'enum', enum: ReviewRating })
  rating: ReviewRating;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  validateRating() {
    if (this.rating < ReviewRating.ONE) this.rating = ReviewRating.ONE;
    if (this.rating > ReviewRating.FIVE) this.rating = ReviewRating.FIVE;
  }
}
