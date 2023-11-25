import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current_user.decorator';
import { CreateCommentDto } from './dto/create-comment';

/**
 * Controller class for managing news-related operations.
 */
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /**
   * Create a new news.
   * @param createNewsDto - The DTO containing the data for creating a news.
   * @param userId - The ID of the user creating the news.
   * @returns An object containing the created news ID and creation timestamp.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createNews(
    @Body() createNewsDto: CreateNewsDto,
    @CurrentUser() userId: string,
  ) {
    const createdNews = await this.newsService.createNews(
      userId,
      createNewsDto,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'News created successfully',
      data: {
        newsId: createdNews.id,
        createdAt: createdNews.createdAt,
      },
    };
  }

  /**
   * Create a new comment for a news.
   * @param newsId - The ID of the news to create the comment for.
   * @param createCommentDto - The DTO containing the data for creating a comment.
   * @returns An object containing the created comment ID and creation timestamp.
   */
  @Post(':newsId/comments')
  async createComment(
    @Param('newsId') newsId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const createdComment = await this.newsService.createComment(
      newsId,
      createCommentDto,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Comment created successfully',
      data: {
        commentId: createdComment.id,
        createdAt: createdComment.createdAt,
      },
    };
  }

  /**
   * Get all news.
   * @returns An object containing the fetched news.
   */
  @Get()
  async findAll() {
    const news = await this.newsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'News fetched successfully',
      data: news,
    };
  }

  /**
   * Get a news by ID.
   * @param id - The ID of the news to fetch.
   * @returns An object containing the fetched news.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const news = await this.newsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'News fetched successfully',
      data: news,
    };
  }

  /**
   * Update a news by ID.
   * @param id - The ID of the news to update.
   * @param updateNewsDto - The DTO containing the data for updating the news.
   * @param userId - The ID of the user updating the news.
   * @returns An object containing the updated news ID and update timestamp.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @CurrentUser() userId: string,
  ) {
    const updatedNews = await this.newsService.update(
      userId,
      id,
      updateNewsDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'News updated successfully',
      data: {
        newsId: updatedNews.id,
        updatedAt: updatedNews.updatedAt,
      },
    };
  }

  /**
   * Remove a news by ID.
   * @param id - The ID of the news to remove.
   * @param userId - The ID of the user removing the news.
   * @returns An object containing the deleted news ID and deletion timestamp.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() userId: string) {
    const deletedNews = await this.newsService.remove(userId, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'News deleted successfully',
      data: {
        newsId: deletedNews.id,
        deletedAt: deletedNews.updatedAt,
      },
    };
  }
}
