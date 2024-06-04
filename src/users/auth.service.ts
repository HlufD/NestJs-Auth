import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

interface User {
  username: string;
  password: string;
  email: string;
}

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async signup({ email, password, username }: User) {
    const salt = randomBytes(8).toString('hex');
    const hashBuffer = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hashBuffer.toString('hex');
    return this.userService.create({
      email,
      password: hashedPassword,
      username,
    });
  }
  async signin({ email, password }: Partial<User>) {
    const user = await this.userService.find(email);
    if (!user) throw new NotFoundException('user not found!');
    const [salt, storedHash] = user.password.split('.');
    const hashBuffer = (await scrypt(password, salt, 32)) as Buffer;
    if (hashBuffer.toString('hex') !== storedHash)
      throw new BadRequestException('bad password');
    return user;
  }
}
