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
  id!: string;

  @Column({ length: 500 })
  name!: string;

  @Column({ type: 'varchar', length: 500, default: 'https://media.istockphoto.com/id/2173059563/vector/coming-soon-image-on-white-background-no-photo-available.jpg?s=612x612&w=0&k=20&c=v0a_B58wPFNDPULSiw_BmPyhSNCyrP_d17i2BPPyDTk=' })
  image_url!: string;

  @OneToMany(() => Product, (product) => product.category, {
    cascade: true,
  })
  products!: Product[];

  @OneToMany(() => PromoCode, (promo_code) => promo_code.category)
  promo_codes?: PromoCode[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
