import { Module } from '@nestjs/common';
import { OrderitemsService } from './orderitems.service';
import { OrderitemsController } from './orderitems.controller';

@Module({
  controllers: [OrderitemsController],
  providers: [OrderitemsService],
  exports: [OrderitemsService],
})
export class OrderitemsModule {}
