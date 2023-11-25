import { News } from 'src/news/entities/news.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  comment: string;

  @ManyToOne(() => News, (news) => news.comments, {
    onDelete: 'CASCADE',
  })
  news: News;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Comment>) {
    Object.assign(this, partial);
  }
}
