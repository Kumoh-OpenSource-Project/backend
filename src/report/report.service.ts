import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from 'src/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { SlackService } from 'nestjs-slack';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
 
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
    private readonly slackService: SlackService,
  ){ }

  async create(
    createReportDto: CreateReportDto,
    userId: number
  ) {      
      const userInfo = await this.userService.getOneUserInfo(userId);
      try{
        await this.slackService.sendText(`\n---------------------------\n신고자 이름: ${userInfo.name}\n신고자 닉네임: ${userInfo.nickName}\n신고자 아이디: ${userId}\n신고 유형: ${createReportDto.type}\n게시글/댓글id: ${createReportDto.id}\n신고 내용: ${createReportDto.reportContent}\n`)
      }catch(error){
        throw new BadRequestException([error]);
      }
      return '신고 접수 완료!';
  }
}
