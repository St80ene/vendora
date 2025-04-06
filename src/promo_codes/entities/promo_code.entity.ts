import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'promo_codes' })
export class PromoCode extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  value: number;

  @Column({ type: 'enum', enum: ['percentage', 'fixed'] })
  type: 'percentage' | 'fixed';

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @Column({ default: false })
  is_active: boolean;

  // Define the relationship with the Product entity
  @ManyToOne(() => Product, (product) => product.promo_codes, {
    nullable: true,
  })
  @JoinColumn({ name: 'applies_to_product_id' }) // Specifies the foreign key
  product: Product;

  @ManyToOne(() => Category, (category) => category.promo_codes, {
    nullable: true,
  })
  @JoinColumn({ name: 'applies_to_category_id' }) // Specifies the foreign key
  category: Category;
}
