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
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current_user.decorator';

/**
 * Controller for managing pages.
 */
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  /**
   * Create a new page.
   * @param createPageDto - The data for creating a page.
   * @param userId - The ID of the user creating the page.
   * @returns The created page.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPageDto: CreatePageDto,
    @CurrentUser() userId: string,
  ) {
    const createdPage = await this.pagesService.create(userId, createPageDto);
    return {
      statusCode: 201,
      message: 'Page created successfully',
      data: {
        pageID: createdPage.id,
        createdAt: createdPage.createdAt,
      },
    };
  }

  /**
   * Get all pages.
   * @returns All pages.
   */
  @Get()
  async findAll() {
    const pages = await this.pagesService.findAll();
    return {
      statusCode: 200,
      message: 'Pages fetched successfully',
      data: pages,
    };
  }

  /**
   * Get a page by ID.
   * @param id - The ID of the page.
   * @returns The page with the specified ID.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const page = await this.pagesService.findOne(id);
    return {
      statusCode: 200,
      message: 'Page fetched successfully',
      data: page,
    };
  }

  /**
   * Update a page by ID.
   * @param id - The ID of the page.
   * @param updatePageDto - The data for updating the page.
   * @param userId - The ID of the user updating the page.
   * @returns The updated page.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
    @CurrentUser() userId: string,
  ) {
    const updatedPage = await this.pagesService.update(
      userId,
      id,
      updatePageDto,
    );
    return {
      statusCode: 200,
      message: 'Page updated successfully',
      data: {
        pageID: updatedPage.id,
        updatedAt: updatedPage.updatedAt,
      },
    };
  }

  /**
   * Remove a page by ID.
   * @param id - The ID of the page.
   * @param userId - The ID of the user removing the page.
   * @returns The deleted page.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() userId: string) {
    const deletedPage = await this.pagesService.remove(userId, id);
    return {
      statusCode: 200,
      message: 'Page deleted successfully',
      data: {
        pageID: deletedPage.id,
        deletedAt: deletedPage.updatedAt,
      },
    };
  }
}
