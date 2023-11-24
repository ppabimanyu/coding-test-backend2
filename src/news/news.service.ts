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

  // CreateNews method is used to create a new news
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

  // CreateComment method is used to create a new comment
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

  // FindAll method is used to find all news
  async findAll(): Promise<News[]> {
    return this.newsRepository.find({});
  }

  // FindOne method is used to find a news by id
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

  // Update method is used to update a news by id
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

  // Remove method is used to remove a news by id
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
