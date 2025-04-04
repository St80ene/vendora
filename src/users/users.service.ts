import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existing = await User.findOne({
        where: { email: createUserDto.email },
      });
      if (existing) {
        throw new ConflictException('User with this email already exists');
      }

      const user = User.create(createUserDto);
      return await user.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating user', error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await User.find();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users', error);
    }
  }

  async findOne(email: string): Promise<User> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user', error);
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by ID', error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findById(id);
      Object.assign(user, updateUserDto);
      return await user.save();
    } catch (error) {
      throw new InternalServerErrorException('Error updating user', error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await user.remove();
      return { message: 'User successfully deleted' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user', error);
    }
  }
}
