import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackModule, SlackService } from 'nestjs-slack';
import { User } from 'src/entities/User';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
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
