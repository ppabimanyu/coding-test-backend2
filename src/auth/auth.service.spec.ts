// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';

// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [AuthService],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: Repository<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('Login', () => {
    it('should return a token when valid credentials are provided', async () => {
      const req: LoginDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      const user = new User({
        id: '1',
        username: 'testuser',
        password: 'hashedpassword',
      });

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('testtoken');
      jest.spyOn(configService, 'getOrThrow').mockReturnValue('jwtsecret');

      const result = await service.Login(req);

      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        username: req.username,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(req.password, user.password);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: user.id, username: user.username },
        { expiresIn: '1d', secret: 'jwtsecret' },
      );
      expect(result).toEqual('testtoken');
    });

    it('should throw NotFoundException when user is not found', async () => {
      const req: LoginDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(undefined);

      await expect(service.Login(req)).rejects.toThrow(NotFoundException);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        username: req.username,
      });
    });

    it('should throw BadRequestException when invalid credentials are provided', async () => {
      const req: LoginDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      const user = new User({
        id: '1',
        username: 'testuser',
        password: 'hashedpassword',
      });

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await expect(service.Login(req)).rejects.toThrow(BadRequestException);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        username: req.username,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(req.password, user.password);
    });
  });

  describe('Register', () => {
    it('should create and return a new user when valid credentials are provided', async () => {
      const req: LoginDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      const user = new User({
        id: '1',
        username: 'testuser',
        password: 'hashedpassword',
      });

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(undefined);
      jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => 'salt');
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedpassword');
      jest.spyOn(usersRepository, 'create').mockReturnValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      const result = await service.Register(req);

      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        username: req.username,
      });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(req.password, 'salt');
      expect(usersRepository.create).toHaveBeenCalledWith({
        username: req.username,
        password: 'hashedpassword',
      });
      expect(usersRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should throw BadRequestException when user already exists', async () => {
      const req: LoginDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      const user = new User({
        id: '1',
        username: 'testuser',
        password: 'hashedpassword',
      });

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);

      await expect(service.Register(req)).rejects.toThrow(BadRequestException);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        username: req.username,
      });
    });
  });
});
