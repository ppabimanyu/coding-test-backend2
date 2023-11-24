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

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  // Create method is controller used to create a new page
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

  // FindAll method is controller used to find all pages
  @Get()
  async findAll() {
    const pages = await this.pagesService.findAll();
    return {
      statusCode: 200,
      message: 'Pages fetched successfully',
      data: pages,
    };
  }

  // FindOne method is controller used to find a page by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const page = await this.pagesService.findOne(id);
    return {
      statusCode: 200,
      message: 'Page fetched successfully',
      data: page,
    };
  }

  // Update method is controller used to update a page by id
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

  // Remove method is controller used to remove a page by id
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
