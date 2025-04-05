import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { OrderitemsModule } from 'src/orderitems/orderitems.module';

@Module({
  controllers: [OrdersController],
  imports: [UsersModule, ProductsModule, OrderitemsModule],
  providers: [OrdersService],
})
export class OrdersModule {}
