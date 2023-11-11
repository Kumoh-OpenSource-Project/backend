import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { id } from 'date-fns/locale';
import { UserInfoDto } from 'src/common/dto/user/user.dto';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ){}

  async getAllUsersInfo(){
    return await this.userRepo.find();
  }

  async getOneUserInfo(serviceId: number){ 
    const findedUser = await this.userRepo.findOne({
      where: {id: serviceId},
    })

    if(!findedUser){ throw new BadRequestException(['옳지 않은 요청입니다.']) }
    return findedUser;
  }

 async fixUserInfo(serviceId: number, fixUserInfo: UserInfoDto){
    
    if(fixUserInfo.userImage === undefined && fixUserInfo.userImage){
      return this.fixUserNickname(serviceId, fixUserInfo);
    }
    if(fixUserInfo.userNickName === undefined && fixUserInfo.userImage){
      return this.fixUserImage(serviceId, fixUserInfo);
    }

    throw new BadRequestException(['올바르지 않은 요청입니다.']);
 }

  async fixUserNickname(
    serviceId: number,
    fixUserInfo: UserInfoDto
  ){
      
    if(fixUserInfo.userNickName === undefined){ throw new BadRequestException(['올바르지 않은 접근입니다. 11'])};
    const user = await this.userRepo.findOneOrFail({
      where: {id: serviceId},
      });

    if(!user) {throw new NotFoundException([` ${serviceId} 사용자가 존재하지 않습니다.`]);}
      
    user.nickName = fixUserInfo.userNickName;        
    await this.userRepo.save(user);  
    return user;

  }
  
  async fixUserImage(
    serviceId: number, 
    fixUserInfo: UserInfoDto
  ){
    if(fixUserInfo.userImage === undefined){ throw new BadRequestException(['올바르지 않은 접근입니다. 요청하는 이미지url이 없습니다.'])};
    
    const user = await this.userRepo.findOneOrFail({
      where: {id: serviceId},
     });

    if(!user) {throw new NotFoundException([` ${serviceId} 사용자가 존재하지 않습니다.`]);}
     
    user.profilePhoto = fixUserInfo.userImage;        
    await this.userRepo.save(user);  
    return user;
  }

}
