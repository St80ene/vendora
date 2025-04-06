import { CloudinaryModule } from './../cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadController } from './uploads.controller';

@Module({
  controllers: [UploadController],
  providers: [UploadsService],
  exports: [UploadsService],
  imports: [CloudinaryModule],
})
export class UploadsModule {}
