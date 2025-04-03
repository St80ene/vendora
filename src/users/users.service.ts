import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(email: string) {
    try {
      const existing_user = await User.find({ where: { email } });

      if (existing_user) return new NotFoundException();

      return existing_user;
    } catch (error) {
      return new InternalServerErrorException();
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // return `This action updates a #${id} user`;
  }

  remove(id: number) {
    // return `This action removes a #${id} user`;
  }

  async findById(id: string): Promise<any> {
    try {
      return await User.findOne({
        where: { id },
      });
    } catch (error) {
      new InternalServerErrorException('Error finding agent', error);
    }
  }
}
