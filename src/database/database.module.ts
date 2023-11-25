import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Represents the database module of the application.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (conf: ConfigService) => ({
        type: 'mysql',
        host: conf.getOrThrow('DB_HOST'),
        port: conf.getOrThrow<number>('DB_PORT'),
        username: conf.getOrThrow('DB_USERNAME'),
        password: conf.getOrThrow('DB_PASSWORD'),
        database: conf.getOrThrow('DB_DATABASE'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
