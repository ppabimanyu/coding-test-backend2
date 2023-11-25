import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PagesService } from './pages.service';
import { Page } from './entities/page.entity';
import { User } from 'src/auth/entities/user.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

describe('PagesService', () => {
  let service: PagesService;
  let pageRepository: Repository<Page>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagesService,
        {
          provide: getRepositoryToken(Page),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PagesService>(PagesService);
    pageRepository = module.get<Repository<Page>>(getRepositoryToken(Page));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new page', async () => {
      // Arrange
      const userId = 'user-id';
      const req: CreatePageDto = {
        customUrl: 'custom-url',
        pageContent: 'Page content',
      };
      const user = new User({});
      user.id = userId;
      const newPage = new Page({});
      newPage.user = user;
      newPage.customUrl = req.customUrl;
      newPage.pageContent = req.pageContent;
      const createdPage = new Page({});
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(pageRepository, 'create').mockReturnValue(newPage);
      jest.spyOn(pageRepository, 'save').mockResolvedValue(createdPage);

      // Act
      const result = await service.create(userId, req);

      // Assert
      expect(result).toBe(createdPage);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(pageRepository.create).toHaveBeenCalledWith({
        user,
        customUrl: req.customUrl,
        pageContent: req.pageContent,
      });
      expect(pageRepository.save).toHaveBeenCalledWith(newPage);
    });

    it('should throw BadRequestException if user is not found', async () => {
      // Arrange
      const userId = 'user-id';
      const req: CreatePageDto = {
        customUrl: 'custom-url',
        pageContent: 'Page content',
      };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(pageRepository, 'create').mockReturnValue(null);
      jest.spyOn(pageRepository, 'save').mockReturnValue(null);

      // Act & Assert
      await expect(service.create(userId, req)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(pageRepository.create).not.toHaveBeenCalled();
      expect(pageRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should retrieve all pages', async () => {
      // Arrange
      const pageList = [new Page({}), new Page({})];
      jest.spyOn(pageRepository, 'find').mockResolvedValue(pageList);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toBe(pageList);
      expect(pageRepository.find).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should find a page by its ID', async () => {
      // Arrange
      const id = 'page-id';
      const page = new Page({});
      jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(result).toBe(page);
      expect(pageRepository.findOne).toHaveBeenCalledWith({
        where: { id },
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
    });

    it('should throw BadRequestException if page is not found', async () => {
      // Arrange
      const id = 'page-id';
      jest.spyOn(pageRepository, 'findOne').mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.findOne(id)).rejects.toThrow(BadRequestException);
      expect(pageRepository.findOne).toHaveBeenCalledWith({
        where: { id },
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
    });
  });

  describe('update', () => {
    it('should update a page', async () => {
      // Arrange
      const userId = 'user-id';
      const id = 'page-id';
      const updatePageDto: UpdatePageDto = {
        customUrl: 'updated-custom-url',
        pageContent: 'Updated page content',
      };
      const page = new Page({});
      page.user = new User({});
      page.user.id = userId;
      page.id = id;
      const updatedPage = new Page({});
      jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
      jest.spyOn(pageRepository, 'save').mockResolvedValue(updatedPage);

      // Act
      const result = await service.update(userId, id, updatePageDto);

      // Assert
      expect(result).toBe(updatedPage);
      expect(pageRepository.findOne).toHaveBeenCalledWith({
        where: {
          id,
          user: {
            id: userId,
          },
        },
      });
      expect(pageRepository.save).toHaveBeenCalledWith({
        ...page,
        ...updatePageDto,
      });
    });

    it('should throw BadRequestException if page is not found', async () => {
      // Arrange
      const userId = 'user-id';
      const id = 'page-id';
      const updatePageDto: UpdatePageDto = {
        customUrl: 'updated-custom-url',
        pageContent: 'Updated page content',
      };
      jest.spyOn(pageRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(pageRepository, 'save').mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(userId, id, updatePageDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(pageRepository.findOne).toHaveBeenCalledWith({
        where: {
          id,
          user: {
            id: userId,
          },
        },
      });
      expect(pageRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a page', async () => {
      // Arrange
      const userId = 'user-id';
      const id = 'page-id';
      const page = new Page({});
      page.user = new User({});
      page.user.id = userId;
      page.id = id;
      const deletedPage = new Page({});
      jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
      jest.spyOn(pageRepository, 'remove').mockResolvedValue(deletedPage);

      // Act
      const result = await service.remove(userId, id);

      // Assert
      expect(result).toBe(deletedPage);
      expect(pageRepository.findOne).toHaveBeenCalledWith({
        where: {
          id,
          user: {
            id: userId,
          },
        },
      });
      expect(pageRepository.remove).toHaveBeenCalledWith(page);
    });

    it('should throw BadRequestException if page is not found', async () => {
      // Arrange
      const userId = 'user-id';
      const id = 'page-id';
      jest.spyOn(pageRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(pageRepository, 'remove').mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(userId, id)).rejects.toThrow(
        BadRequestException,
      );
      expect(pageRepository.findOne).toHaveBeenCalledWith({
        where: {
          id,
          user: {
            id: userId,
          },
        },
      });
      expect(pageRepository.remove).not.toHaveBeenCalled();
    });
  });
});
