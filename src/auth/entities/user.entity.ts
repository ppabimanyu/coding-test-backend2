import { Category } from 'src/category/entities/category.entity';
import { News } from 'src/news/entities/news.entity';
import { Page } from 'src/pages/entities/page.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => News, (news) => news.author, {
    cascade: true,
  })
  news: News[];

  @OneToMany(() => Category, (category) => category.user, {
    cascade: true,
  })
  categories: Category[];

  @OneToMany(() => Page, (page) => page.user, {
    cascade: true,
  })
  pages: Page[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
