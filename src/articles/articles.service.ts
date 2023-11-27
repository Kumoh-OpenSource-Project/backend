import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article-dto';
import { UpdateArticleDto } from './dto/update-article-dto';
import { Like, Repository } from 'typeorm';
import { Article } from 'src/entities/Article';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from 'src/entities/Photo';
import { ArticleIdDto } from './dto/article-id-dto';
import { UserClipped } from 'src/entities/UserClipped';
import { UserLike } from 'src/entities/UserLike';
import { Comment } from 'src/entities/Comment';
import { CreateCommentDto } from './dto/create-comment-dto';

@Injectable()
export class ArticlesService {

  private readonly PAGESIZE = 10;

  constructor( 
    @InjectRepository(Article) private articleRepo : Repository<Article>,
    @InjectRepository(Photo) private photoRepo : Repository<Photo>,
    @InjectRepository(UserClipped) private clippingRepo: Repository<UserClipped>,
    @InjectRepository(UserLike) private likeRepo: Repository<UserLike>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ){}
  
  async findAllArticle(type: number, userId: number, offset: number) {
    const articles = await this.articleRepo.find({
      where: { categoryId: type },
      relations: ['photos', 'writer', 'comments' ],
      order: { id: 'DESC' },
      take: this.PAGESIZE,
      skip: offset * this.PAGESIZE, 
    });
  
    const articlesWithStatus = [];

    for (const article of articles) {
      const isLikedByUser = await this.likeRepo.findOne({
        where: { userId, articleId: article.id },
      });
      const isClippedByUser = await this.clippingRepo.findOne({
        where: { userId, articleId: article.id },
      });

      const commentCount = article.comments.length;
      const imageUrlList = article.photos.map(photo => photo.imageUrl); 

      articlesWithStatus.push({
        id: article.id,
        writerId: article.writerId,
        writerNickName: article.writer?.nickName,
        writerLevel:article.writer?.level,
        title: article.title,
        contextText: article.contextText,
        date: article.date,
        commentCount: commentCount,
        like: article.like,
        clipped: article.clipped,
        isLike: !!isLikedByUser,
        isClipped: !!isClippedByUser,
        photo: imageUrlList,
      });
    }
    return articlesWithStatus;
  }


  async findArticle(articleId: number, userId: number){
    const article = await this.articleRepo.findOne({
            where: { id: articleId},
            relations: ['photos', 'writer', 'comments' ]
    });
    if (!article) { throw new NotFoundException('해당하는 게시글이 없습니다.'); }

    const isLikedByUser = await this.likeRepo.findOne({
      where: { userId, articleId: article.id },
    });
    const isClippedByUser = await this.clippingRepo.findOne({
      where: { userId, articleId: article.id },
    });
    const imageUrlList = article.photos.map(photo => photo.imageUrl); 
    const commentCount = article.comments.length;
    const comments = await this.commentRepo.find({
      where: {articleId: articleId},
      relations: ['user']
    });
    const commentsWithStatus = [];
    
    for (const comment of comments) {
      commentsWithStatus.push({
        id:comment.id,
        contextText: comment.contextText,
        date: comment.date,
        userId: comment.userId,
        userNickName: comment.user.nickName,
        userLevel: comment.user.level,
      })
    }
    return {
      id: article.id,
      writerId: article.writerId,
      writerNickName: article.writer?.nickName,
      writerLevel:article.writer?.level,
      title: article.title,
      contextText: article.contextText,
      date: article.date,
      like: article.like,
      clipped: article.clipped,
      isLike: !!isLikedByUser,
      isClipped: !!isClippedByUser,
      photo: imageUrlList,
      comments: commentsWithStatus,
    }
  }


  
  async findOneArticle(articleId: number){
    const article = await this.articleRepo.findOne({
            where: { id: articleId},
    });
    if (!article) { throw new NotFoundException('해당하는 게시글이 없습니다.'); }

    return article;
  }


async findArticleByContext(searchString: string, userId: number,  offset: number) {

  const articles = await this.articleRepo.find({
    where: [
      { title: Like(`%${searchString}%`) },
      { contextText: Like(`%${searchString}%`) },
    ],
    order: { id: 'DESC' },
    take: this.PAGESIZE,
    skip: +offset * this.PAGESIZE,
    relations: ['photos', 'writer'], // 필요한 관계를 포함할 경우 추가
  });
  
  const articlesWithStatus = [];
  
  for (const article of articles) {
    const isLikedByUser = await this.likeRepo.findOne({
      where: { userId, articleId: article.id },
    });
  
    const isClippedByUser = await this.clippingRepo.findOne({
      where: { userId, articleId: article.id },
    });

    const commentCount = article.comments.length;
    const imageUrlList = article.photos.map(photo => photo.imageUrl); 

    articlesWithStatus.push({
      id: article.id,
      writerId: article.writerId,
      writerNickName: article.writer?.nickName,
      writerLevel:article.writer?.level,
      title: article.title,
      contextText: article.contextText,
      date: article.date,
      commentCount: commentCount,
      like: article.like,
      clipped: article.clipped,
      isLike: !!isLikedByUser,
      isClipped: !!isClippedByUser,
      photo: imageUrlList
    });
  }
  return articlesWithStatus;
}

  async create(
    createArticleDto: CreateArticleDto,
    userId: number,
  ) {
    const typeNum = CreateArticleDto.mapTypeToNumber(createArticleDto.type);
    const newArticle = this.articleRepo.create({
      writerId: userId,
      categoryId: typeNum,
      title: createArticleDto.title,
      contextText: createArticleDto.content,
      like: 0,
      clipped: 0,
    });
    await this.articleRepo.save(newArticle);
    
    if (createArticleDto.photo && createArticleDto.photo.length > 0) {
      for (const photoUrl of createArticleDto.photo) {
          const inputPhoto = this.photoRepo.create({
            articleId: newArticle.id,
            imageUrl: photoUrl,
          })
          await this.photoRepo.save(inputPhoto);
      }
    }
    return '작성완료';  
}

  async update(
    userId: number,
    updateArticleDto: UpdateArticleDto, 
  ) {
      const { articleId, content } = updateArticleDto;
      const article = await this.findOneArticle(articleId);
      if(article.writerId !== userId){ throw new UnauthorizedException(['게시글을 수정할 권한이 없습니다.'])};
      article.contextText = content;
      await this.articleRepo.save(article);
      return [`${articleId}번 게시글 수정 완료`]
  }

  async remove(articleId: number, userId: number) {
    const article = await this.findOneArticle(articleId);
    if(article.writerId !== userId){ throw new UnauthorizedException(['게시글을 삭제할 권한이 없습니다.'])};
    await this.articleRepo.remove(article);
    return [`${articleId}번 게시글 삭제 완료`]
  }

  async checkLikeRepo(articleDto: ArticleIdDto, userId: number){
    const exsitLikeSlot = await this.likeRepo.findOne({
      where: {
        articleId: articleDto.articleId,
        userId: userId,
      }
    })
    if(exsitLikeSlot){ return exsitLikeSlot; } 
    return false;
  }

  async checkClippingRepo(articleDto: ArticleIdDto, userId: number){
    const exsitClippingSlot = await this.clippingRepo.findOne({
      where: {
        articleId: articleDto.articleId,
        userId: userId,
      }
    })
    if(exsitClippingSlot){ return exsitClippingSlot; } 
    return false;
  }


  async plusLike(articleDto:ArticleIdDto, userId: number){
    const checkSlot = await this.checkLikeRepo(articleDto, userId);
    if(checkSlot){throw new BadRequestException(['이미 좋아요를 누르셨습니다.'])};
    
    const newHeart = this.likeRepo.create({
      articleId: articleDto.articleId,
      userId: userId,
    })
    await this.likeRepo.save(newHeart);
    const article = await this.findOneArticle(articleDto.articleId);
    article.like++;
    await this.articleRepo.save(article);
    return '좋아요 완료';
  }

  async removeLike(articleDto:ArticleIdDto, userId: number){
    const checkSlot = await this.checkLikeRepo(articleDto, userId);
    if(!checkSlot){throw new BadRequestException(['삭제할 수 없습니다.'])};
    await this.likeRepo.remove(checkSlot);
    const article = await this.findOneArticle(articleDto.articleId);
    article.like--;
    await this.articleRepo.save(article);
    return '좋아요 삭제 완료';
  }

  async plusClipping(articleDto:ArticleIdDto, userId: number){
    const checkSlot = await this.checkClippingRepo(articleDto, userId);
    if(checkSlot){throw new BadRequestException(['이미 스크랩을 누르셨습니다.'])};
    const newClipping = this.clippingRepo.create({
      articleId: articleDto.articleId,
      userId: userId,
    })
    await this.clippingRepo.save(newClipping);
    const article = await this.findOneArticle(articleDto.articleId);
    article.clipped++;
    await this.articleRepo.save(article);
    return '스크랩 완료';
  }

  async removeClipping(articleDto:ArticleIdDto, userId: number){
    const checkSlot = await this.checkClippingRepo(articleDto, userId);
    if(!checkSlot){throw new BadRequestException(['삭제할 수 없습니다.'])};
    await this.clippingRepo.remove(checkSlot);
    const article = await this.findOneArticle(articleDto.articleId);
    article.clipped--;
    await this.articleRepo.save(article);
    return '스크랩 삭제 완료';
  }


  async getComments(articleId: number){
    const comments = await this.commentRepo.find({
      where: {articleId: articleId},
      relations: ['user']
    });

    const commentsWithStatus = [];
    for (const comment of comments) {
      commentsWithStatus.push({
        id:comment.id,
        articleId: comment.articleId,
        contextText: comment.contextText,
        date: comment.date,
        userId: comment.userId,
        userNickName: comment.user.nickName,
        userLevel: comment.user.level,
      })
    }
    return commentsWithStatus;
  }


  async makeComment(commentDto: CreateCommentDto, userId: number){
    if(!await this.findOneArticle(commentDto.articleId)){
      throw new BadRequestException(['작성할 게시글이 존재하지 않습니다 !'])  ; 
    }

    const newComment = this.commentRepo.create({
      articleId: commentDto.articleId,
      userId: userId,
      contextText: commentDto.content 
    })
    await this.commentRepo.save(newComment);
    return '작성 완료';
  }

  async deleteComment(commentId: number, userId: number){
    const comment = await this.commentRepo.findOne({
      where: { id: commentId }
    })
    if(!comment){throw new NotFoundException(['해당 댓글이 존재하지 않습니다.'])};
    if(comment.userId !== userId){throw new UnauthorizedException(['본인의 댓글이 아닙니다.'])};
    if(!await this.findOneArticle(comment.articleId)){
      throw new BadRequestException(['게시글이 존재하지 않습니다 !'])  ; 
    }
    await this.commentRepo.remove(comment);
    return '삭제완료';
  }
}
