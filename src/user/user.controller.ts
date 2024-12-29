import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'Details of the user to register',
    examples: {
      valid: {
        summary: 'Valid Input',
        value: {
          publicKey: '3Pabc12345...',
          email: 'user@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registration pending approval',
    schema: {
      example: 'User registration pending approval',
    },
  })
  async registerUser(
    @Body() user: { publicKey: string; email: string },
  ): Promise<string> {
    await this.userService.registerUser(user.publicKey, user.email);
    return 'User registration pending approval';
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get all pending user registrations' })
  @ApiResponse({
    status: 200,
    description: 'List of pending users',
    schema: {
      example: [
        {
          publicKey: '3Pabc12345...',
          email: 'user@example.com',
          role: 'intern',
          approved: false,
        },
      ],
    },
  })
  async getPendingUsers(): Promise<any[]> {
    return this.userService.getPendingUsers();
  }

  @Post('approve/:publicKey')
  @ApiOperation({ summary: 'Approve a pending user' })
  @ApiParam({
    name: 'publicKey',
    description: 'Public key of the user to approve',
    example: '3Pabc12345...',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirmation of approval',
    schema: {
      example: 'User 3Pabc12345... approved',
    },
  })
  async approveUser(@Param('publicKey') publicKey: string): Promise<string> {
    await this.userService.approveUser(publicKey);
    return `User ${publicKey} approved`;
  }

  @Post('assign-role/:publicKey')
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiParam({
    name: 'publicKey',
    description: 'Public key of the user',
    example: '3Pabc12345...',
  })
  @ApiBody({
    description: 'Role to assign to the user',
    examples: {
      assign: {
        summary: 'Assign Role',
        value: { role: 'developer' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Role assignment confirmation',
    schema: {
      example: 'Role developer assigned to user 3Pabc12345...',
    },
  })
  async assignRole(
    @Param('publicKey') publicKey: string,
    @Body('role') role: string,
  ): Promise<string> {
    await this.userService.assignRole(publicKey, role);
    return `Role ${role} assigned to user ${publicKey}`;
  }

  @Get('find')
  @ApiOperation({ summary: 'Retrieve a user by publicKey or email' })
  @ApiQuery({
    name: 'publicKey',
    required: false,
    description: 'Public key of the user',
    example: '3Pabc12345...',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    schema: {
      example: {
        publicKey: '3Pabc12345...',
        email: 'user@example.com',
        role: 'developer',
        approved: true,
      },
    },
  })
  async getUser(
    @Query('publicKey') publicKey?: string,
    @Query('email') email?: string,
  ): Promise<any> {
    if (!publicKey && !email) {
      throw new Error(
        'At least one query parameter (publicKey or email) is required',
      );
    }

    const user = await this.userService.getUser(publicKey, email);
    return user;
  }
}
