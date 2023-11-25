import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/auth/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment';

@Injectable()
export class NewsService {
  constructor(
    // Inject the news repository
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    // Inject the category repository
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    // Inject the user repository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // Inject the comment repository
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  /**
   * Creates a new news article.
   * @param userId - The ID of the author.
   * @param req - The request object containing the news details.
   * @returns The newly created news article.
   * @throws BadRequestException if the author or category is not found.
   */
  async createNews(userId: string, req: CreateNewsDto) {
    // find author by userId
    const author = await this.userRepository.findOneBy({ id: userId });
    if (!author) {
      throw new BadRequestException('Author not found');
    }

    // find category by categoryId
    const category = await this.categoryRepository.findOneBy({
      id: req.categoryId,
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    // create new news
    const newNews = this.newsRepository.create({
      author,
      category,
      content: req.content,
    });
    const createdNews = await this.newsRepository.save(newNews);
    return createdNews;
  }

  /**
   * Creates a new comment for a news article.
   * @param newsId - The ID of the news article.
   * @param req - The request object containing the comment details.
   * @returns A Promise that resolves to the created comment.
   * @throws BadRequestException if the news article is not found.
   */
  async createComment(newsId: string, req: CreateCommentDto): Promise<Comment> {
    // find news by newsId
    const news = await this.newsRepository.findOneBy({
      id: newsId,
    });
    if (!news) {
      throw new BadRequestException('News not found');
    }

    // create new comment
    const comment = this.commentRepository.create({
      ...req,
      news,
    });
    const createdComment = await this.commentRepository.save(comment);
    return createdComment;
  }

  /**
   * Retrieves all news.
   * @returns A promise that resolves to an array of News objects.
   */
  async findAll(): Promise<News[]> {
    return this.newsRepository.find({});
  }

  /**
   * Finds a news item by its ID.
   * @param id - The ID of the news item to find.
   * @returns A Promise that resolves to the found news item.
   * @throws BadRequestException if the news item is not found.
   */
  async findOne(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: {
        id,
      },
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
    if (!news) {
      throw new BadRequestException('News not found');
    }
    return news;
  }

  /**
   * Updates a news article.
   * @param userId - The ID of the user performing the update.
   * @param id - The ID of the news article to update.
   * @param updateNewsDto - The data to update the news article with.
   * @returns A Promise that resolves to the updated news article.
   * @throws BadRequestException if the news article is not found.
   */
  async update(
    userId: string,
    id: string,
    updateNewsDto: UpdateNewsDto,
  ): Promise<News> {
    // Check if news exists
    const news = await this.newsRepository.findOne({
      where: {
        id,
        author: {
          id: userId,
        },
      },
    });
    if (!news) {
      throw new BadRequestException('News not found');
    }

    // Update news
    const updatedNews = await this.newsRepository.save({
      ...news,
      ...updateNewsDto,
    });
    return updatedNews;
  }

  /**
   * Removes a news item.
   * @param userId - The ID of the user who is removing the news item.
   * @param id - The ID of the news item to be removed.
   * @returns A Promise that resolves to the deleted news item.
   * @throws BadRequestException if the news item is not found.
   */
  async remove(userId: string, id: string): Promise<News> {
    // Check if news exists
    const news = await this.newsRepository.findOne({
      where: {
        id,
        author: {
          id: userId,
        },
      },
    });
    if (!news) {
      throw new BadRequestException('News not found');
    }

    // Remove news
    const deletedNews = await this.newsRepository.remove(news);
    deletedNews.id = id;
    return deletedNews;
  }
}
