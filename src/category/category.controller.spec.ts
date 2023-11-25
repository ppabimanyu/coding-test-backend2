import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
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

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  describe('create', () => {
    it('should create a new category', async () => {
      // Arrange
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };
      const userId = 'testUserId';

      // Mock the service method
      const createdCategory = new Category({
        id: 'testCategoryId',
        name: createCategoryDto.name,
        createdAt: new Date(),
      });
      jest.spyOn(service, 'create').mockResolvedValue(createdCategory);

      // Act
      const result = await controller.create(createCategoryDto, userId);

      // Assert
      expect(result).toEqual({
        statusCode: 201,
        message: 'Category created successfully',
        data: {
          categoryID: createdCategory.id,
          createdAt: createdCategory.createdAt,
        },
      });
      expect(service.create).toHaveBeenCalledWith(userId, createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should get all categories', async () => {
      // Arrange
      const categories = [
        new Category({
          id: 'testCategoryId1',
          name: 'Test Category 1',
          createdAt: new Date(),
        }),
        new Category({
          id: 'testCategoryId2',
          name: 'Test Category 2',
          createdAt: new Date(),
        }),
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(categories);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual({
        statusCode: 200,
        message: 'Categories fetched successfully',
        data: categories,
      });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should get a category by ID', async () => {
      // Arrange
      const id = 'testCategoryId';
      const category = new Category({
        id,
        name: 'Test Category',
        createdAt: new Date(),
      });
      jest.spyOn(service, 'findOne').mockResolvedValue(category);

      // Act
      const result = await controller.findOne(id);

      // Assert
      expect(result).toEqual({
        statusCode: 200,
        message: 'Category fetched successfully',
        data: category,
      });
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a category by ID', async () => {
      // Arrange
      const id = 'testCategoryId';
      const updateCategoryDto = {
        name: 'Test Category',
      };
      const userId = 'testUserId';

      // Mock the service method
      const updatedCategory = new Category({
        id,
        name: updateCategoryDto.name,
        updatedAt: new Date(),
      });
      jest.spyOn(service, 'update').mockResolvedValue(updatedCategory);

      // Act
      const result = await controller.update(id, updateCategoryDto, userId);

      // Assert
      expect(result).toEqual({
        statusCode: 200,
        message: 'Category updated successfully',
        data: {
          categoryID: updatedCategory.id,
          updatedAt: updatedCategory.updatedAt,
        },
      });
      expect(service.update).toHaveBeenCalledWith(
        userId,
        id,
        updateCategoryDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a category by ID', async () => {
      // Arrange
      const id = 'testCategoryId';
      const userId = 'testUserId';

      // Mock the service method
      const deletedCategory = new Category({
        id,
        name: 'Test Category',
        updatedAt: new Date(),
      });
      jest.spyOn(service, 'remove').mockResolvedValue(deletedCategory);

      // Act
      const result = await controller.remove(id, userId);

      // Assert
      expect(result).toEqual({
        statusCode: 200,
        message: 'Category deleted successfully',
        data: {
          categoryId: deletedCategory.id,
          deletedAt: deletedCategory.updatedAt,
        },
      });
      expect(service.remove).toHaveBeenCalledWith(userId, id);
    });
  });
});
