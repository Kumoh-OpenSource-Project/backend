import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Repository } from 'typeorm';
import { Article } from 'src/entities/Article';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  constructor( 
    @InjectRepository(Article)
    private articleRepo : Repository<Article>
  ){}
  
  async create(
    createArticleDto: CreateArticleDto,
    userId: number,
  ) {
    const newArticle = this.articleRepo.create({
      writerId: userId,
      categoryId: createArticleDto.articleCategory,
      title: createArticleDto.title,
      contextText: createArticleDto.contextText,
      like: 0,
      clipped: 0,
    });
    await this.articleRepo.save(newArticle);
    return HttpStatus.CREATED;  
}


  // findAll() {
  //   return this.articleRepo.find();
  //   }


  async findScopeArticle(){
    const articles = await this.articleRepo.find({
       where: { categoryId: 1 },
       order: { id: 'DESC' }, });
    return articles;
  }

  async findPlaceArticle(){
    const articles = await this.articleRepo.find({
      where: { categoryId: 2 },
      order: { id: 'DESC' }, });
   return articles;
  }

  async   findPhotoArticle(){
    const articles = await this.articleRepo.find({
      where: { categoryId: 3 },
      order: { id: 'DESC' }, });
   return articles;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
