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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    NestjsFormDataModule.configAsync({
      useFactory: () => ({
        storage: MemoryStoredFile,
      }),
    }),
    // MailerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (cfg: ConfigService) => ({
    //     transport: cfg.get(`mail.drivers.${cfg.get('mail.mailer')}`),
    //     defaults: {
    //       from: `${cfg.get('mail.from')} < ${cfg.get('mail.address')} >`,
    //     },
    //     template: {
    //       dir: __dirname + '/mails/templates',
    //       adapter: new HandlebarsAdapter({
    //         isset: (value) => value !== undefined,
    //       }),
    //     },
    //     options: {
    //       partials: {
    //         dir: __dirname + '/mails/templates/layouts',
    //       },
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
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
