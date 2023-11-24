import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PagesService {
  constructor(
    // Inject the page repository
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    // Inject the user repository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //  Create method is used to create a new page
  async create(userId: string, createPageDto: CreatePageDto): Promise<Page> {
    // Find user by userId
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Create new page
    const newPage = this.pageRepository.create({
      user,
      customUrl: createPageDto.customUrl,
      pageContent: createPageDto.pageContent,
    });
    const createdPage = await this.pageRepository.save(newPage);
    return createdPage;
  }

  // FindAll method is used to find all pages
  async findAll(): Promise<Page[]> {
    return this.pageRepository.find({});
  }

  // FindOne method is used to find a page by id
  async findOne(id: string): Promise<Page> {
    const page = await this.pageRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
      select: {
        id: true,
        customUrl: true,
        pageContent: true,
        createdAt: true,
        user: {
          id: true,
          username: true,
        },
      },
    });
    if (!page) {
      throw new BadRequestException('Page not found');
    }
    return page;
  }

  // Update method is used to update a page by id
  async update(
    userId: string,
    id: string,
    updatePageDto: UpdatePageDto,
  ): Promise<Page> {
    // Find page by id
    const page = await this.pageRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
    if (!page) {
      throw new BadRequestException('Page not found');
    }

    // Update page
    const updatedPage = await this.pageRepository.save({
      ...page,
      ...updatePageDto,
    });
    return updatedPage;
  }

  // Remove method is used to remove a page by id
  async remove(userId: string, id: string): Promise<Page> {
    // Find page by id
    const page = await this.pageRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
    if (!page) {
      throw new BadRequestException('Page not found');
    }

    // Delete page
    const deletedPage = await this.pageRepository.remove(page);
    deletedPage.id = id;
    return deletedPage;
  }
}
