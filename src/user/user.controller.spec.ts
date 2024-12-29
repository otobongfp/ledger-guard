import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(
    @Body() user: { publicKey: string; email: string },
  ): Promise<string> {
    await this.userService.registerUser(user.publicKey, user.email);
    return 'User registration pending approval';
  }

  @Get('pending')
  async getPendingUsers(): Promise<any[]> {
    return this.userService.getPendingUsers();
  }

  @Post('approve/:publicKey')
  async approveUser(@Param('publicKey') publicKey: string): Promise<string> {
    await this.userService.approveUser(publicKey);
    return `User ${publicKey} approved`;
  }

  @Post('assign-role/:publicKey')
  async assignRole(
    @Param('publicKey') publicKey: string,
    @Body('role') role: string,
  ): Promise<string> {
    await this.userService.assignRole(publicKey, role);
    return `Role ${role} assigned to user ${publicKey}`;
  }
}
