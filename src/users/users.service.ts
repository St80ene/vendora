import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  ApiResponse,
  successResponse,
  errorResponse,
} from 'src/utils/response.utils';
import { UploadsService } from 'src/uploads/uploads.service';

@Injectable()
export class UsersService {
  constructor(private readonly uploadsService: UploadsService) {}
  async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    try {
      const existing = await User.findOne({
        where: { email: createUserDto.email },
      });
      if (existing) {
        throw new ConflictException(
          errorResponse('User with this email already exists')
        );
      }

      const user = User.create(createUserDto);
      await user.save();
      return successResponse('User created successfully', user);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error creating user', error)
      );
    }
  }

  async uploadAvatar(user_id: string, file) {
    const { data: user } = await this.findById(user_id);
    if (!user) throw new NotFoundException('User not found');

    const result = await this.uploadsService.uploadFile(file);
    user.avatar_url = result.url;
    user.avatar_public_id = result.public_id;

    return user.save();
  }

  async updateAvatar(user_id: string, file) {
    const { data: user } = await this.findById(user_id);
    if (!user) throw new NotFoundException('User not found');

    const result = await this.uploadsService.updateFile(
      file,
      user.avatar_public_id
    );
    user.avatar_url = result.url;
    user.avatar_public_id = result.public_id;

    return user.save();
  }

  async deleteAvatar(user_id: string) {
    const { data: user } = await this.findById(user_id);
    if (!user) throw new NotFoundException('User not found');

    if (user.avatar_public_id) {
      await this.uploadsService.deleteFile(user.avatar_public_id);
      user.avatar_url = null;
      user.avatar_public_id = null;
      return user.save();
    }

    return user;
  }

  async findAll({
    page = 1,
    limit = 10,
  }): Promise<ApiResponse<{ users: User[]; total: number }>> {
    try {
      const pageNumber = page || 1;
      const skip = (pageNumber - 1) * limit;

      const [users, total] = await User.findAndCount({
        take: limit,
        skip,
        relations: { addresses: true },
      });

      return successResponse('Users retrieved successfully', { users, total });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching users', error)
      );
    }
  }

  async findOne(email: string): Promise<ApiResponse<User>> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(errorResponse('User not found'));
      }
      return successResponse('User retrieved successfully', user);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error fetching user', error)
      );
    }
  }

  async findById(id: string): Promise<ApiResponse<User>> {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(errorResponse('User not found'));
      }
      return successResponse('User retrieved successfully', user as User);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error finding user by ID', error)
      );
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<ApiResponse<User>> {
    try {
      const user = await this.findById(id);
      Object.assign(user.data, updateUserDto);
      await user.data.save();
      return successResponse('User updated successfully', user.data);
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error updating user', error)
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(errorResponse('User not found'));
      }

      await user.remove();
      return successResponse('User successfully deleted', { deleted: true });
    } catch (error) {
      throw new InternalServerErrorException(
        errorResponse('Error deleting user', error)
      );
    }
  }
}
