import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Controller for handling authentication related endpoints.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint for user registration.
   * @param req - The registration request body.
   * @returns A response object containing the status code, message, and user data.
   */
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

  /**
   * Endpoint for user login.
   * @param req - The login request body.
   * @returns A response object containing the status code, message, and authentication token.
   */
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
