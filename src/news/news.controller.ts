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

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // CreateNews method is controller used to create a new news
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

  // CreateComment method is controller used to create a new comment
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

  // FindAll method is controller used to find all news
  @Get()
  async findAll() {
    const news = await this.newsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'News fetched successfully',
      data: news,
    };
  }

  // FindOne method is controller used to find a news by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const news = await this.newsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'News fetched successfully',
      data: news,
    };
  }

  // Update method is controller used to update a news by id
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

  // Remove method is controller used to remove a news by id
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
