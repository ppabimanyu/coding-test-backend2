import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateCommentDto } from './dto/create-comment';
import { News } from './entities/news.entity';
import { Comment } from './entities/comment.entity';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';

describe('NewsController', () => {
  let controller: NewsController;
  let newsService: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        {
          provide: NewsService,
          useValue: {
            createNews: jest.fn(),
            createComment: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NewsController>(NewsController);
    newsService = module.get<NewsService>(NewsService);
  });

  describe('createNews', () => {
    it('should create a new news', async () => {
      const createNewsDto: CreateNewsDto = {
        categoryId: 'category-id',
        content: 'content',
      };
      const userId = 'user-id';

      const createdNews = new News({
        id: 'news-id',
        createdAt: new Date(),
      });

      jest.spyOn(newsService, 'createNews').mockResolvedValue(createdNews);

      const result = await controller.createNews(createNewsDto, userId);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'News created successfully',
        data: {
          newsId: createdNews.id,
          createdAt: createdNews.createdAt,
        },
      });
      expect(newsService.createNews).toHaveBeenCalledWith(
        userId,
        createNewsDto,
      );
    });
  });

  describe('createComment', () => {
    it('should create a new comment for a news', async () => {
      const newsId = 'news-id';
      const createCommentDto: CreateCommentDto = {
        name: 'name',
        comment: 'comment',
      };

      const createdComment = new Comment({
        id: 'comment-id',
        createdAt: new Date(),
      });

      jest
        .spyOn(newsService, 'createComment')
        .mockResolvedValue(createdComment);

      const result = await controller.createComment(newsId, createCommentDto);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Comment created successfully',
        data: {
          commentId: createdComment.id,
          createdAt: createdComment.createdAt,
        },
      });
      expect(newsService.createComment).toHaveBeenCalledWith(
        newsId,
        createCommentDto,
      );
    });
  });

  describe('findAll', () => {
    it('should get all news', async () => {
      const news = [
        new News({
          id: 'news-id',
          content: 'content',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new News({
          id: 'news-id',
          content: 'content',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      jest.spyOn(newsService, 'findAll').mockResolvedValue(news);

      const result = await controller.findAll();

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'News fetched successfully',
        data: news,
      });
      expect(newsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should get a news by ID', async () => {
      const id = 'news-id';
      const news = new News({
        id: 'news-id',
        content: 'content',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: new User({
          id: 'user-id',
          username: 'username',
        }),
        category: new Category({
          id: 'category-id',
          name: 'name',
        }),
        comments: [
          new Comment({
            id: 'comment-id',
            name: 'name',
            comment: 'comment',
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ],
      });

      jest.spyOn(newsService, 'findOne').mockResolvedValue(news);

      const result = await controller.findOne(id);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'News fetched successfully',
        data: news,
      });
      expect(newsService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a news by ID', async () => {
      const id = 'news-id';
      const updateNewsDto: UpdateNewsDto = {
        // Provide the necessary data for updateNewsDto
      };
      const userId = 'user-id';

      const updatedNews = new News({
        id: 'news-id',
        updatedAt: new Date(),
      });

      jest.spyOn(newsService, 'update').mockResolvedValue(updatedNews);

      const result = await controller.update(id, updateNewsDto, userId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'News updated successfully',
        data: {
          newsId: updatedNews.id,
          updatedAt: updatedNews.updatedAt,
        },
      });
      expect(newsService.update).toHaveBeenCalledWith(
        userId,
        id,
        updateNewsDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a news by ID', async () => {
      const id = 'news-id';
      const userId = 'user-id';

      const deletedNews = new News({
        id: 'news-id',
        updatedAt: new Date(),
      });

      jest.spyOn(newsService, 'remove').mockResolvedValue(deletedNews);

      const result = await controller.remove(id, userId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'News deleted successfully',
        data: {
          newsId: deletedNews.id,
          deletedAt: deletedNews.updatedAt,
        },
      });
      expect(newsService.remove).toHaveBeenCalledWith(userId, id);
    });
  });
});
