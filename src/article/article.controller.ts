import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus, BadRequestException, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UserAuthGuard } from 'src/guard/user.auth.guard';
import { UserId } from 'src/common/decorator/user.id.decorator';
import { ArticleInformationDto } from './dto/article-informaition.dto';

@UseGuards(UserAuthGuard)
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}


  @Get('/:id')
  async findOneArticleById(
    @Param('id', new ParseIntPipe()) articleId: number
  ){
    return await this.articleService.findOneArticle(articleId);
  }

  @Get()
  async findArticleById(
    @Query(ValidationPipe) query: ArticleInformationDto,
  ) {
      const articleTypeNumber = ArticleInformationDto.mapTypeToNumber(query.type);
      const { offset } = query;
      return await this.articleService.findAllArticle(articleTypeNumber, +offset);
    }

  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @UserId() userId: number 
  ) {
    return await this.articleService.create(createArticleDto, userId);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: string,
     @Body() updateArticleDto: UpdateArticleDto,
     @UserId() userId: number 
     ) {
    return await this.articleService.update(+id,  userId, updateArticleDto);
  }

  @Delete('/:id')
  remove(
  @Param('id', new ParseIntPipe()) id: string,
  @UserId() userId: number 
  ) {
    return this.articleService.remove(+id, userId);
  }
}
