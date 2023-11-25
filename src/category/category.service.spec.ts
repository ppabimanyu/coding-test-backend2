import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { User } from 'src/auth/entities/user.entity';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<Category>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const userId = 'user-id';
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };
      const category = new Category({});
      category.name = createCategoryDto.name;
      const user = new User({});
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(categoryRepository, 'create').mockReturnValue(category);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(category);

      const result = await service.create(userId, createCategoryDto);

      expect(categoryRepository.findOneBy).toHaveBeenCalledWith({
        name: createCategoryDto.name,
      });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(categoryRepository.create).toHaveBeenCalledWith({
        user,
        name: createCategoryDto.name,
      });
      expect(categoryRepository.save).toHaveBeenCalledWith(category);
      expect(result).toEqual(category);
    });

    it('should throw BadRequestException if category already exists', async () => {
      const userId = 'user-id';
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };
      const category = new Category({});
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(category);

      await expect(service.create(userId, createCategoryDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(categoryRepository.findOneBy).toHaveBeenCalledWith({
        name: createCategoryDto.name,
      });
    });

    it('should throw BadRequestException if user not found', async () => {
      const userId = 'user-id';
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.create(userId, createCategoryDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(categoryRepository.findOneBy).toHaveBeenCalledWith({
        name: createCategoryDto.name,
      });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories: Category[] = [
        new Category({
          id: '1',
          name: 'Category 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new Category({
          id: '2',
          name: 'Category 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];
      jest.spyOn(categoryRepository, 'find').mockResolvedValue(categories);

      const result = await service.findAll();

      expect(categoryRepository.find).toHaveBeenCalledWith({});
      expect(result).toEqual(categories);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const categoryId = 'category-id';
      const category: Category = new Category({
        id: categoryId,
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: new User({}),
      });
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);

      const result = await service.findOne(categoryId);

      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: categoryId,
        },
        relations: ['user'],
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            username: true,
          },
        },
      });
      expect(result).toEqual(category);
    });

    it('should throw BadRequestException if category not found', async () => {
      const categoryId = 'category-id';
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(categoryId)).rejects.toThrow(
        BadRequestException,
      );
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: categoryId,
        },
        relations: ['user'],
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          user: {
            id: true,
            username: true,
          },
        },
      });
    });
  });

  describe('update', () => {
    it('should update a category by id', async () => {
      const userId = 'user-id';
      const categoryId = 'category-id';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };
      const category: Category = new Category({
        id: categoryId,
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: new User({}),
      });
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(category);

      const result = await service.update(
        userId,
        categoryId,
        updateCategoryDto,
      );

      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: categoryId,
          user: {
            id: userId,
          },
        },
      });
      expect(categoryRepository.save).toHaveBeenCalledWith({
        ...category,
        ...updateCategoryDto,
      });
      expect(result).toEqual(category);
    });

    it('should throw BadRequestException if category not found', async () => {
      const userId = 'user-id';
      const categoryId = 'category-id';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(userId, categoryId, updateCategoryDto),
      ).rejects.toThrow(BadRequestException);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: categoryId,
          user: {
            id: userId,
          },
        },
      });
    });
  });

  describe('remove', () => {
    it('should remove a category by id', async () => {
      const userId = 'user-id';
      const categoryId = 'category-id';
      const category: Category = new Category({
        id: categoryId,
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: new User({}),
      });
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);
      jest.spyOn(categoryRepository, 'remove').mockResolvedValue(category);

      const result = await service.remove(userId, categoryId);

      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: categoryId,
          user: {
            id: userId,
          },
        },
      });
      expect(categoryRepository.remove).toHaveBeenCalledWith(category);
      expect(result).toEqual(category);
    });

    it('should throw BadRequestException if category not found', async () => {
      const userId = 'user-id';
      const categoryId = 'category-id';
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(userId, categoryId)).rejects.toThrow(
        BadRequestException,
      );
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: categoryId,
          user: {
            id: userId,
          },
        },
      });
    });
  });
});
