import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HomeModule } from './home/home.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), HomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
