import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPass = await bcrypt.hash(createUserDto.password, 12);

    try {
      const isUserNameBusy = await this.findByUsername(createUserDto.login);
      if (isUserNameBusy) {
        throw 'username';
      }
    } catch (err) {
      if (err === 'username') {
        throw new ConflictException('Username is already taken');
      }
    }

    const user = await this.userModel.create({
      login: createUserDto.login,
      password: hashedPass,
    });
    delete user.password;
    return user;
  }

  async findAll(): Promise<Array<User>> {
    return this.userModel.find();
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel
      .findOne({ login: username })
      .select('password');
    if (!user) {
      throw new NotFoundException('Not found');
    }
    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Not found');
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    await this.findOne(id);

    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.userModel.deleteOne({ _id: id });
    return { message: 'Successfully deleted!' };
  }
}
