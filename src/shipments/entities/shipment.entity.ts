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
import { ShipmentStatus } from '../enums/shipment-status.enum';

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
    enum: ShipmentStatus,
    default: 'pending',
  })
  status: string;

  @Column({ type: 'varchar' })
  courier: string;

  @Column({ type: 'datetime' })
  shipped_at: Date;

  @Column({ type: 'varchar' })
  label_url: string;

  @Column({ type: 'datetime' })
  delivered_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Order, (order) => order.shipment, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Address, { onDelete: 'CASCADE' })
  address: Address;
}
