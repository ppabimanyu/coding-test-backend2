import { Test, TestingModule } from '@nestjs/testing';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { Page } from './entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { User } from 'src/auth/entities/user.entity';
import { UpdatePageDto } from './dto/update-page.dto';

describe('PagesController', () => {
  let controller: PagesController;
  let service: PagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagesController],
      providers: [
        {
          provide: PagesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PagesController>(PagesController);
    service = module.get<PagesService>(PagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new page', async () => {
      const createPageDto: CreatePageDto = {
        customUrl: 'custom-url',
        pageContent: 'Page content',
      };
      const userId = 'user-id';
      const createdPage = new Page({
        id: 'page-id',
        createdAt: new Date(),
      });

      jest.spyOn(service, 'create').mockResolvedValue(createdPage);

      const result = await controller.create(createPageDto, userId);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Page created successfully',
        data: {
          pageID: createdPage.id,
          createdAt: createdPage.createdAt,
        },
      });
      expect(service.create).toHaveBeenCalledWith(userId, createPageDto);
    });
  });

  describe('findAll', () => {
    it('should get all pages', async () => {
      const pages = [
        new Page({
          id: 'page-id-1',
          customUrl: 'custom-url-1',
          pageContent: 'Page content 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new Page({
          id: 'page-id-2',
          customUrl: 'custom-url-2',
          pageContent: 'Page content 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(pages);

      const result = await controller.findAll();

      expect(result).toEqual({
        statusCode: 200,
        message: 'Pages fetched successfully',
        data: pages,
      });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should get a page by ID', async () => {
      const id = 'page-id';
      const page = new Page({
        id: 'page-id',
        customUrl: 'custom-url',
        pageContent: 'Page content',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: new User({
          id: 'user-id',
          username: 'username',
        }),
      });

      jest.spyOn(service, 'findOne').mockResolvedValue(page);

      const result = await controller.findOne(id);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Page fetched successfully',
        data: page,
      });
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a page by ID', async () => {
      const id = 'page-id';
      const updatePageDto: UpdatePageDto = {
        customUrl: 'custom-url',
        pageContent: 'page-content',
      };
      const userId = 'user-id';
      const updatedPage = new Page({
        id: 'page-id',
        updatedAt: new Date(),
      });

      jest.spyOn(service, 'update').mockResolvedValue(updatedPage);

      const result = await controller.update(id, updatePageDto, userId);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Page updated successfully',
        data: {
          pageID: updatedPage.id,
          updatedAt: updatedPage.updatedAt,
        },
      });
      expect(service.update).toHaveBeenCalledWith(userId, id, updatePageDto);
    });
  });

  describe('remove', () => {
    it('should remove a page by ID', async () => {
      const id = 'page-id';
      const userId = 'user-id';
      const deletedPage = new Page({
        id: 'page-id',
        updatedAt: new Date(),
      });

      jest.spyOn(service, 'remove').mockResolvedValue(deletedPage);

      const result = await controller.remove(id, userId);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Page deleted successfully',
        data: {
          pageID: deletedPage.id,
          deletedAt: deletedPage.updatedAt,
        },
      });
      expect(service.remove).toHaveBeenCalledWith(userId, id);
    });
  });
});
