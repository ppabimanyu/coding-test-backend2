import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async Register(@Body() req: RegisterDto) {
    const createdUser = await this.authService.Register(req);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: {
        userID: createdUser.id,
        createdAt: createdUser.createdAt,
      },
    };
  }

  @Post('login')
  async Login(@Body() req: LoginDto) {
    const token = await this.authService.Login(req);
    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      token,
    };
  }
}
