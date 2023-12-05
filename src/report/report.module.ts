import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackModule, SlackService } from 'nestjs-slack';
import { User } from 'src/entities/User';
import { ConfigService } from '@nestjs/config';
import { Article } from 'src/entities/Article';
import { Comment } from 'src/entities/Comment';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Article,
      Comment
    ]),
    SlackModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'webhook',
          url: configService.get<string>('SLACK_WEB_HOOK_URL'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [ReportController],
  providers: [ReportService,UserService,SlackService],
})
export class ReportModule {}
