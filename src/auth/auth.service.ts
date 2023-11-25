import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Service responsible for authentication-related operations.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Authenticates a user and generates a JWT token.
   * @param req - The login request containing the username and password.
   * @returns The JWT token.
   * @throws NotFoundException if the user is not found.
   * @throws BadRequestException if the credentials are invalid.
   */
  async Login(req: LoginDto): Promise<string> {
    const user = await this.usersRepository.findOneBy({
      username: req.username,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(req.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwtService.sign(
      { sub: user.id, username: user.username },
      {
        expiresIn: '1d',
        secret: this.configService.getOrThrow('JWT_SECRET'),
      },
    );

    return token;
  }

  /**
   * Registers a new user.
   * @param req - The registration request containing the username and password.
   * @returns The created user.
   * @throws BadRequestException if the user already exists.
   */
  async Register(req: LoginDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      username: req.username,
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.password, salt);

    const newUser = this.usersRepository.create({
      username: req.username,
      password: hashedPassword,
    });
    const createdUser = await this.usersRepository.save(newUser);

    return createdUser;
  }
}
