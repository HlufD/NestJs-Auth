import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.find(createUserDto.email);
    if (existingUser) throw new BadRequestException('email already in use!');
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  find(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async findOne(id: number) {
    if (!id) return null;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found!');
    return user;
  }

  async update(id: number, attr: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('user not found!');
    Object.assign(user, attr);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('user not found!');
    return this.userRepo.remove(user);
  }
}
