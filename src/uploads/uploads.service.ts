// src/uploads/uploads.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

import * as dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class UploadsService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(file): Promise<{ url: string; public_id: string }> {
    const result = await this.cloudinaryService.uploadImage(file);
    return { url: result.secure_url, public_id: result.public_id };
  }

  async updateFile(
    file,
    oldPublicId: string
  ): Promise<{ url: string; public_id: string }> {
    // Delete the old image first
    await this.cloudinaryService.deleteImage(oldPublicId);
    // Then upload the new one
    const result = await this.cloudinaryService.uploadImage(file);
    return { url: result.secure_url, public_id: result.public_id };
  }

  async deleteFile(publicId: string): Promise<{ result: string }> {
    return this.cloudinaryService.deleteImage(publicId);
  }
}
