import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current_user.decorator';

/**
 * Controller class for managing categories.
 */
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Create a new category.
   * @param createCategoryDto - The DTO containing the category data.
   * @param userId - The ID of the user creating the category.
   * @returns The created category.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() userId: string,
  ) {
    const createdCategory = await this.categoryService.create(
      userId,
      createCategoryDto,
    );
    return {
      statusCode: 201,
      message: 'Category created successfully',
      data: {
        categoryID: createdCategory.id,
        createdAt: createdCategory.createdAt,
      },
    };
  }

  /**
   * Get all categories.
   * @returns All categories.
   */
  @Get()
  async findAll() {
    const categories = await this.categoryService.findAll();
    return {
      statusCode: 200,
      message: 'Categories fetched successfully',
      data: categories,
    };
  }

  /**
   * Get a category by ID.
   * @param id - The ID of the category to retrieve.
   * @returns The category with the specified ID.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(id);
    return {
      statusCode: 200,
      message: 'Category fetched successfully',
      data: category,
    };
  }

  /**
   * Update a category by ID.
   * @param id - The ID of the category to update.
   * @param updateCategoryDto - The DTO containing the updated category data.
   * @param userId - The ID of the user updating the category.
   * @returns The updated category.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() userId: string,
  ) {
    const updatedCategory = await this.categoryService.update(
      userId,
      id,
      updateCategoryDto,
    );
    return {
      statusCode: 200,
      message: 'Category updated successfully',
      data: {
        categoryID: updatedCategory.id,
        updatedAt: updatedCategory.updatedAt,
      },
    };
  }

  /**
   * Remove a category by ID.
   * @param id - The ID of the category to remove.
   * @param userId - The ID of the user removing the category.
   * @returns The deleted category.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() userId: string) {
    const deletedCategory = await this.categoryService.remove(userId, id);
    return {
      statusCode: 200,
      message: 'Category deleted successfully',
      data: {
        categoryId: deletedCategory.id,
        deletedAt: deletedCategory.updatedAt,
      },
    };
  }
}
