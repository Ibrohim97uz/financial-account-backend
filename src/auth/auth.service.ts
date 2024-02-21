import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) readonly adminModel: Model<User>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async register(body: LoginDto): Promise<LoginDto & { access_token: string }> {
    const user = await this.userService.create(body);

    const payload = { id: user._id };
    return {
      ...user.toObject(),
      access_token: this.jwtService.sign(payload, {
        privateKey: process.env.secretForToken,
        expiresIn: '24h',
      }),
    };
  }

  async login(body: LoginDto) {
    const user = await this.userService.findByUsername(body.login);

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Login or password incorrect!');
    }

    const payload = { id: user._id };
    return {
      ...user.toObject(),
      access_token: this.jwtService.sign(payload, {
        privateKey: process.env.secretForToken,
        expiresIn: '24h',
      }),
    };
  }
}
