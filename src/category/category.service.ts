import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    // Inject the category repository
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    // Inject the user repository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create method is used to create a new category
  async create(userId: string, req: CreateCategoryDto): Promise<Category> {
    // Check if category already exists
    const category = await this.categoryRepository.findOneBy({
      name: req.name,
    });
    if (category) {
      throw new BadRequestException('Category already exists');
    }

    // Check if user exists
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Create new category
    const newCategory = this.categoryRepository.create({
      user,
      name: req.name,
    });
    const createdCategory = await this.categoryRepository.save(newCategory);
    return createdCategory;
  }

  // FindAll method is used to find all categories
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({});
  }

  // FindOne method is used to find a category by id
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
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
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return category;
  }

  // Update method is used to update a category by id
  async update(
    userId: string,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // Check if category exists
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    // Update category
    const updatedCategory = await this.categoryRepository.save({
      ...category,
      ...updateCategoryDto,
    });
    return updatedCategory;
  }

  // Remove method is used to remove a category by id
  async remove(userId: string, id: string): Promise<Category> {
    // Check if category exists
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    // Remove category
    const deletedCategory = await this.categoryRepository.remove(category);
    deletedCategory.id = id;
    return deletedCategory;
  }
}
