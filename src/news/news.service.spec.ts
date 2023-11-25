import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { Comment } from './entities/comment.entity';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/auth/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment';

describe('NewsService', () => {
  let service: NewsService;
  let newsRepository: Repository<News>;
  let categoryRepository: Repository<Category>;
  let userRepository: Repository<User>;
  let commentRepository: Repository<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: getRepositoryToken(News),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Comment),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    newsRepository = module.get<Repository<News>>(getRepositoryToken(News));
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    commentRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
  });

  describe('createNews', () => {
    it('should create a new news article', async () => {
      // Arrange
      const userId = 'user-id';
      const req: CreateNewsDto = {
        categoryId: 'category-id',
        content: 'News content',
      };
      const author = new User({});
      author.id = userId;
      const category = new Category({});
      category.id = req.categoryId;
      const newNews = new News({});
      newNews.author = author;
      newNews.category = category;
      newNews.content = req.content;
      const createdNews = new News({});
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(author);
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(category);
      jest.spyOn(newsRepository, 'create').mockReturnValue(newNews);
      jest.spyOn(newsRepository, 'save').mockResolvedValue(createdNews);

      // Act
      const result = await service.createNews(userId, req);

      // Assert
      expect(result).toBe(createdNews);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(categoryRepository.findOneBy).toHaveBeenCalledWith({
        id: req.categoryId,
      });
      expect(newsRepository.create).toHaveBeenCalledWith({
        author,
        category,
        content: req.content,
      });
      expect(newsRepository.save).toHaveBeenCalledWith(newNews);
    });

    it('should throw BadRequestException if author is not found', async () => {
      // Arrange
      const userId = 'user-id';
      const req: CreateNewsDto = {
        categoryId: 'category-id',
        content: 'News content',
      };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(newsRepository, 'create').mockReturnValue(null);
      jest.spyOn(newsRepository, 'save').mockReturnValue(null);

      // Act & Assert
      await expect(service.createNews(userId, req)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(categoryRepository.findOneBy).not.toHaveBeenCalled();
      expect(newsRepository.create).not.toHaveBeenCalled();
      expect(newsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if category is not found', async () => {
      // Arrange
      const userId = 'user-id';
      const req: CreateNewsDto = {
        categoryId: 'category-id',
        content: 'News content',
      };
      const author = new User({});
      author.id = userId;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(author);
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(newsRepository, 'create').mockReturnValue(null);
      jest.spyOn(newsRepository, 'save').mockReturnValue(null);

      // Act & Assert
      await expect(service.createNews(userId, req)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(categoryRepository.findOneBy).toHaveBeenCalledWith({
        id: req.categoryId,
      });
      expect(newsRepository.create).not.toHaveBeenCalled();
      expect(newsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('createComment', () => {
    it('should create a new comment for a news article', async () => {
      // Arrange
      const newsId = 'news-id';
      const req: CreateCommentDto = {
        name: 'John Doe',
        comment: 'Great article!',
      };
      const news = new News({});
      news.id = newsId;
      const comment = new Comment({});
      comment.name = req.name;
      comment.comment = req.comment;
      comment.news = news;
      const createdComment = new Comment({});
      jest.spyOn(newsRepository, 'findOneBy').mockResolvedValue(news);
      jest.spyOn(commentRepository, 'create').mockReturnValue(comment);
      jest.spyOn(commentRepository, 'save').mockResolvedValue(createdComment);

      // Act
      const result = await service.createComment(newsId, req);

      // Assert
      expect(result).toBe(createdComment);
      expect(newsRepository.findOneBy).toHaveBeenCalledWith({ id: newsId });
      expect(commentRepository.create).toHaveBeenCalledWith({
        ...req,
        news,
      });
      expect(commentRepository.save).toHaveBeenCalledWith(comment);
    });

    it('should throw BadRequestException if news article is not found', async () => {
      // Arrange
      const newsId = 'news-id';
      const req: CreateCommentDto = {
        name: 'John Doe',
        comment: 'Great article!',
      };
      jest.spyOn(newsRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(commentRepository, 'create').mockReturnValue(null);
      jest.spyOn(commentRepository, 'save').mockReturnValue(null);

      // Act & Assert
      await expect(service.createComment(newsId, req)).rejects.toThrow(
        BadRequestException,
      );
      expect(newsRepository.findOneBy).toHaveBeenCalledWith({ id: newsId });
      expect(commentRepository.create).not.toHaveBeenCalled();
      expect(commentRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should retrieve all news', async () => {
      // Arrange
      const newsList = [new News({}), new News({})];
      jest.spyOn(newsRepository, 'find').mockResolvedValue(newsList);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toBe(newsList);
      expect(newsRepository.find).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should find a news item by its ID', async () => {
      // Arrange
      const id = 'news-id';
      const news = new News({});
      jest.spyOn(newsRepository, 'findOne').mockResolvedValue(news);

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(result).toBe(news);
      expect(newsRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['author', 'category', 'comments'],
        select: {
          author: {
            id: true,
            username: true,
          },
          category: {
            id: true,
            name: true,
          },
          content: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          comments: {
            id: true,
            name: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      });
    });

    it('should throw BadRequestException if news item is not found', async () => {
      // Arrange
      const id = 'news-id';
      jest.spyOn(newsRepository, 'findOne').mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.findOne(id)).rejects.toThrow(BadRequestException);
      expect(newsRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['author', 'category', 'comments'],
        select: {
          author: {
            id: true,
            username: true,
          },
          category: {
            id: true,
            name: true,
          },
          content: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          comments: {
            id: true,
            name: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      });
    });
  });

  describe('update', () => {
    it('should update a news article', async () => {
      // Arrange
      const userId = 'user-id';
      const id = 'news-id';
      const updateNewsDto: UpdateNewsDto = {
        content: 'Updated news content',
      };
      const news = new News({});
      news.author = new User({});
      news.author.id = userId;
      news.id = id;
      const updatedNews = new News({});
      jest.spyOn(newsRepository, 'findOne').mockResolvedValue(news);
      jest.spyOn(newsRepository, 'save').mockResolvedValue(updatedNews);

      // Act
      const result = await service.update(userId, id, updateNewsDto);

      // Assert
      expect(result).toBe(updatedNews);
      expect(newsRepository.findOne).toHaveBeenCalledWith({
        where: {
          id,
          author: {
            id: userId,
          },
        },
      });
      expect(newsRepository.save).toHaveBeenCalledWith({
        ...news,
        ...updateNewsDto,
      });
    });

    it('should throw BadRequestException if news article is not found', async () => {
      // Arrange
      const userId = 'user-id';
      const id = 'news-id';
      const updateNewsDto: UpdateNewsDto = {
        content: 'Updated news content',
      };
      jest.spyOn(newsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(newsRepository, 'save').mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(userId, id, updateNewsDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(newsRepository.findOne).toHaveBeenCalledWith({
        where: {
          id,
          author: {
            id: userId,
          },
        },
      });
      expect(newsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a news item', async () => {
      // Arrange
      const userId = 'user-id';
      const id = 'news-id';
      const news = new News({});
      news.author = new User({});
      news.author.id = userId;
      news.id = id;
      const deletedNews = new News({});
      jest.spyOn(newsRepository, 'findOne').mockResolvedValue(news);
      jest.spyOn(newsRepository, 'remove').mockResolvedValue(deletedNews);

      // Act
      const result = await service.remove(userId, id);

      // Assert
      expect(result).toBe(deletedNews);
      expect(newsRepository.findOne).toHaveBeenCalledWith({
        where: {
          id,
          author: {
            id: userId,
          },
        },
      });
      expect(newsRepository.remove).toHaveBeenCalledWith(news);
    });

    it('should throw BadRequestException if news item is not found', async () => {
      // Arrange
      const userId = 'user-id';
      const id = 'news-id';
      jest.spyOn(newsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(newsRepository, 'remove').mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(userId, id)).rejects.toThrow(
        BadRequestException,
      );
      expect(newsRepository.findOne).toHaveBeenCalledWith({
        where: {
          id,
          author: {
            id: userId,
          },
        },
      });
      expect(newsRepository.remove).not.toHaveBeenCalled();
    });
  });
});
