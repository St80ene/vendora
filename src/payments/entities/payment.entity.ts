import { Order } from 'src/orders/entities/order.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';

@Entity({ name: 'payments' })
export class Payment extends BaseEntity {
  constructor(props?: Partial<Payment>) {
    super();
    props && Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: string;

  @OneToOne((order) => order.payment)
  order: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
