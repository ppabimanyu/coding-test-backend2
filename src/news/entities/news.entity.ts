import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { User } from 'src/auth/entities/user.entity';
import { Comment } from './comment.entity';

@Entity({ name: 'news' })
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Category, (category) => category.news, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToOne(() => User, (user) => user.news, {
    onDelete: 'CASCADE',
  })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.news, { cascade: true })
  comments: Comment[];

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<News>) {
    Object.assign(this, partial);
  }
}
