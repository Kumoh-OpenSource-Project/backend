import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from 'src/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { SlackService } from 'nestjs-slack';
import { Repository } from 'typeorm';
import { Article } from 'src/entities/Article';
import { Comment } from 'src/entities/Comment';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Article) private readonly articleRepo: Repository<Article>,
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    private readonly userService: UserService,
    private readonly slackService: SlackService,
  ){ }

  async create(
    createReportDto: CreateReportDto,
    userId: number
  ) {      
      const userInfo = await this.userService.getOneUserInfo(userId);
      const urlWithParams = `${process.env.EC2URL}?resource=${createReportDto.type}&id=${createReportDto.id}`
      try{
        await this.slackService.sendText(`\n---------------------------\n신고자 이름: ${userInfo.name}\n신고자 닉네임: ${userInfo.nickName}\n신고자 아이디: ${userId}\n신고 유형: ${createReportDto.type}\n게시글/댓글id: ${createReportDto.id}\n신고 내용: ${createReportDto.reportContent}\n\n삭제하기: ${urlWithParams}\n`)
      }catch(error){
        throw new BadRequestException([error]);
      }
      return '신고 접수 완료!';
  }

  async deleteContent(content: string, contentId: number){
    if(content !== 'comment' && content !== 'article'){
      throw new BadRequestException(['올바르지 않은 요청입니다.']);
    }
    if(content === 'comment'){
          const comment = await this.commentRepo.findOne({
            where: { id: contentId }
          })
          if(!comment){throw new NotFoundException(['해당 댓글이 존재하지 않습니다.'])};
          await this.commentRepo.remove(comment);
          return [`신고된 ${contentId}번 댓글 삭제 완료`]
    }else if(content ==='article'){
          const article = await this.articleRepo.findOne({
            where: { id: contentId},
          });
          if (!article) { throw new NotFoundException('해당하는 게시글이 없습니다.'); }
          await this.articleRepo.remove(article);
          return [`신고된 ${contentId}번 게시글 삭제 완료`]
    }
    throw new BadRequestException(['에러 발생.'])
  }
}
