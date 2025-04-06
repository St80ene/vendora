import { Product } from 'src/products/entities/product.entity';
import { PromoCode } from 'src/promo_codes/entities/promo_code.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  constructor(props?: Partial<Category>) {
    super();
    props && Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  image_url: string;

  @OneToMany(() => Product, (product) => product.category, {
    cascade: true,
  })
  products: Product[];

  @OneToMany(() => PromoCode, (promo_code) => promo_code.category)
  promo_codes: PromoCode[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
