import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { News } from '../../news/entities/news.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.categories, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => News, (news) => news.category, {
    cascade: true,
  })
  news: News[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
