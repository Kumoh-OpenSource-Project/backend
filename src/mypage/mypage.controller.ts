import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { UserId } from 'src/common/decorator/user.id.decorator';
import { UserAuthGuard } from 'src/guard/user.auth.guard';

@Controller('mypage')
@UseGuards(UserAuthGuard)
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  @Get()
  async getPage(@UserId() userId: number, @Query('type') type: string){
    if(type === 'articles'){
      return this.mypageService.getArticles(userId);
    }
    return this.mypageService.getLikesOrClips(userId, type);
  }
}
