import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
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
    return '작성완료';  
}


  // findAll() {
  //   return this.articleRepo.find();
  //   }


  async findScopeArticle(id?: number){

    if(id){
      const article = await this.articleRepo.findOne({
        where: 
        { 
          categoryId: 1,
          id: id,
        },
         });

      if(!article){
        throw new BadRequestException(['찾는 게시글이 존재하지 않습니다.']);
      }
     return article;
    }
    
    const articles = await this.articleRepo.find({
       where: { categoryId: 1 },
       order: { id: 'DESC' }, });
    return articles;
  }

  async findPlaceArticle(id?: number){
    
    if(id){
      const article = await this.articleRepo.findOne({
        where: 
        { 
          categoryId: 2,
          id: id,
        },
         });

      if(!article){
        throw new BadRequestException(['찾는 게시글이 존재하지 않습니다.']);
      }
     return article;
    }
    const articles = await this.articleRepo.find({
      where: { categoryId: 2 },
      order: { id: 'DESC' }, });
   return articles;
  }

  async   findPhotoArticle(id?: number){
    
    if(id){
      const article = await this.articleRepo.findOne({
        where: 
        { 
          categoryId: 3,
          id: id,
        },
         });
         if(!article){
          throw new BadRequestException(['찾는 게시글이 존재하지 않습니다.']);
        }
       return article;
    }

    const articles = await this.articleRepo.find({
      where: { categoryId: 3 },
      order: { id: 'DESC' }, });
   return articles;
  }




  // findOne(id: number) {
  //   return `This action returns a #${id} article`;
  // }

  // update(id: number, updateArticleDto: UpdateArticleDto) {
  //   return `This action updates a #${id} article`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} article`;
  // }


}
