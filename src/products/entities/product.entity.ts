import { Category } from 'src/categories/entities/category.entity';
import { OrderItem } from 'src/orderitems/entities/orderitem.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  Column,
} from 'typeorm';
import { ProductStatus } from '../enums/product-status.enum';
import { PromoCode } from 'src/promo_codes/entities/promo_code.entity';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  constructor(props?: Partial<Product>) {
    super();
    props && Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 }) // quantity available for sales.
  stock: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discount_value: number;

  @Column({ type: 'enum', enum: ['percentage', 'fixed'], nullable: true })
  discount_type: 'percentage' | 'fixed';

  @Column({ type: 'timestamp', nullable: true })
  discount_expires_at: Date;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @OneToMany(() => OrderItem, (order_item) => order_item.product)
  order_items: OrderItem[];

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => PromoCode, (promo_code) => promo_code.product)
  promo_codes: PromoCode[];

  @OneToMany(() => Review, (review) => review.product, {
    cascade: true,
  })
  reviews: Review[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
