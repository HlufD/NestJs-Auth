import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Serialize } from 'src/Interceptors /serialize.Interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RestPasswordDto } from './dto/reset-password.dto';

@Controller()
@Serialize(UserDto)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  // Auth related operations
  @UseGuards(AuthGuard)
  @Get('users/whoami')
  whoAmi(@CurrentUser() user: any): User {
    return user;
  }

  @Post('auth/signup')
  async signup(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signup(body);
    session.userId = user.id;
    return user;
  }

  @Post('auth/signin')
  async signin(
    @Body() { email, password }: Partial<CreateUserDto>,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signin({ email, password });
    session.userId = user.id;
    return user;
  }

  @Post('auth/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }
  @Post('auth/forget-password')
  async forgetPassword(@Body() body: Partial<User>) {
    const res = await this.authService.forgetPassword(body.email);
    return res;
  }

  @Post('auth/reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() { password, confirmPassword }: RestPasswordDto,
  ) {
    return this.authService.resetPassword(token, password, confirmPassword);
  }

  // Operation on User
  @Get('users')
  getUserByEmail(@Query() { email }: { email: string }) {
    return this.userService.find(email);
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Delete('users/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('users/:id')
  updateUser(@Body() body: Partial<User>, @Param('id') id: string) {
    return this.userService.update(parseInt(id), body);
  }
}
