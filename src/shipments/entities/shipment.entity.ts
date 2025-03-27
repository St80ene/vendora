import { Address } from 'src/addresses/entities/address.entity';
import { Order } from 'src/orders/entities/order.entity';
import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'shipments' })
export class Shipment extends BaseEntity {
  constructor(props?: Partial<Shipment>) {
    super();
    props && Object.assign(this, props);
  }

  @Column({ type: 'int', unique: true })
  tracking_number: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'varchar' })
  courier: string;

  @Column({ type: 'datetime' })
  shipped_at: Date;

  @Column({ type: 'datetime' })
  delivered_at: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Order, (order) => order.shipment, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Address, { onDelete: 'CASCADE' })
  address: Address;
}
