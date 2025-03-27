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

  @Column({ type: 'enum', enum: ['pending', 'completed', 'failed'] })
  status: string;

  @Column({ type: 'enum', enum: ['credit_card', 'paypal', 'bank_transfer'] })
  payment_method: string;

  @OneToOne((order) => order.payment)
  order: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
