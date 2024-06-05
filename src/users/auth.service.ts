import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';

interface User {
  username: string;
  password: string;
  email: string;
}

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

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
  async forgetPassword(email: string) {
    const user = await this.userService.find(email);
    if (!user) throw new NotFoundException('email not registered!');
    const payload = { email, id: user.id };
    const token = await this.jwtService.signAsync(payload);
    this.mailerService.sendEmailWithTemplate(
      'hluf@mailtrap.com',
      user.email,
      'Password Reset',
      `
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <a href="http://localhost:3000/auth/reset-password/${token}">Reset Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    );
  }
  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string,
  ) {
    try {
      const { id } = await this.jwtService.verify(token);
      if (password !== confirmPassword)
        throw new BadRequestException('Password dose not match!');
      const salt = randomBytes(10).toString('hex');
      const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;
      const hash = salt + '.' + hashedPassword.toString('hex');
      return this.userService.update(id, { password: hash });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
