import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UserAuthGuard } from 'src/guard/user.auth.guard';
import { UserId } from 'src/common/decorator/user.id.decorator';

@UseGuards(UserAuthGuard)
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @UserId() userId: number 
  ) {
    return await this.articleService.create(createArticleDto, userId);
  }

  // @Get()
  // findAll(
  //   @UserId() userId: number 
  // ) {
  //   return this.articleService.findAll();
  // }

  @Get('scope')
  async findScope(){
    return await this.articleService.findScopeArticle();
  }

  @Get('place')
  async findPlace(){
    return await this.articleService.findPlaceArticle();
  }

  @Get('photo')
  async findPhoto(){
    return await this.articleService.findPhotoArticle();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
     @Body() updateArticleDto: UpdateArticleDto,
     @UserId() userId: number 
     ) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(
  @Param('id') id: string,
  @UserId() userId: number 
  ) {
    return this.articleService.remove(+id);
  }
}
