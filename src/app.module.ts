import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { PagesModule } from './pages/pages.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    AuthModule,
    NewsModule,
    PagesModule,
    ConfigModule,
    DatabaseModule,
    CategoryModule,
  ],
})
export class AppModule {}
