import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService],
  imports: [UploadsModule],
})
export class UsersModule {}
