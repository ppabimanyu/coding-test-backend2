import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { HttpStatus } from '@nestjs/common';
import { User } from './entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            Register: jest.fn(),
            Login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('Register', () => {
    it('should create a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'johndoe',
        password: 'password123',
      };

      const createdUser = new User({
        id: '1',
        username: registerDto.username,
        password: registerDto.password,
        createdAt: new Date(),
      });

      jest.spyOn(authService, 'Register').mockResolvedValue(createdUser);

      const response = await authController.Register(registerDto);

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.message).toBe('User created successfully');
      expect(response.data.userID).toBe(createdUser.id);
      expect(response.data.createdAt).toBe(createdUser.createdAt);
    });
  });

  describe('Login', () => {
    it('should log in a user', async () => {
      const loginDto: LoginDto = {
        username: 'johndoe',
        password: 'password123',
      };

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmciOiJ1dF8zMTYwIiwiaWQiOjEsImRpc3BsYXkiOiJ0b2tlbiIsInVzZXJuYW1lIjoid2VsbG9tZSIsImlhdCI6MTY2NTY5ODMyMCwiZXhwIjoxNjY1Nzk5MzIwfQ.2-37_lL664y67v-Z0b656426lX8j93pQ1p6z6-q4';

      jest.spyOn(authService, 'Login').mockResolvedValue(token);

      const response = await authController.Login(loginDto);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.message).toBe('User logged in successfully');
      expect(response.token).toBe(token);
    });
  });
});
