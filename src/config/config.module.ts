import { Module } from '@nestjs/common';
import { ConfigModule as AppConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AppConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
