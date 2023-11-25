import { Module } from '@nestjs/common';
import { ConfigModule as AppConfigModule } from '@nestjs/config';

/**
 * Represents the configuration module of the application.
 */
@Module({
  imports: [
    AppConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
