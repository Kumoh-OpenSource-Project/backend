import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './articles/articles.module';
import { ReportModule } from './report/report.module';
import { MypageModule } from './mypage/mypage.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
  TypeOrmModule.forRoot({
    type: process.env.DATABASE_TYPE as any,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT as any,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/**/*{.ts,.js}'],
    synchronize: false,
  }),
  AuthModule,
  HomeModule,
  UserModule,
  ArticleModule,
  ReportModule,
  MypageModule,
],
  controllers: [AppController],
  providers: [AppService],
}) 
export class AppModule {}
