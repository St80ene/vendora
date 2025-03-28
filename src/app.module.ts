import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { PaymentsModule } from './payments/payments.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { AddressesModule } from './addresses/addresses.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';
import { OrderitemsModule } from './orderitems/orderitems.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ShipmentsModule,
    PaymentsModule,
    ProductsModule,
    CartsModule,
    AddressesModule,
    CategoriesModule,
    ReviewsModule,
    OrdersModule,
    OrderitemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
