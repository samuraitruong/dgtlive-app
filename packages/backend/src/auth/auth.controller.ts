import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { User } from './db/user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {

  }
  @Post('register')
  async registerUser(@Body() body: { username: string; password: string }): Promise<{ message: string }> {
    const { username, password } = body;
    await this.authService.registerUser(username, password);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async loginUser(@Body() body: { username: string; password: string }): Promise<{ message: string; token: string }> {
    const { username, password } = body;
    const token = await this.authService.loginUser(username, password);
    return { message: 'Login successful', token };
  }

  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(): Promise<Partial<User>[]> {
    const users = await this.authService.getUsers();
    return users.map(u => ({ username: u.username }))
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getUsers1(@Req() req: any): Promise<Partial<User>[]> {
    return req['user']
  }

}
