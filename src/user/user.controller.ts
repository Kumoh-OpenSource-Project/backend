import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuthGuard } from 'src/guard/user.auth.guard';
import { UserInfoDto } from 'src/common/dto/user/user.dto';
import { UserAllInfoDto } from 'src/common/dto/user/userAllInfo.dto';
import { UserId } from 'src/common/decorator/user.id.decorator';

@UseGuards(UserAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Get()
    async getUserInfo(@UserId() userId : number) {
        return await this.userService.getOneUserInfo(userId);
        
    }

    @Patch(':id')
    async fixUserInfo(
        @UserId() userId : number,
        @Body() fixedUserDto: UserInfoDto
    ){
        return await this.userService.fixUserInfo(userId, fixedUserDto)
    }

    @Put(':id')
    async fixUserAllInfo(
        @UserId() userId : number,
        @Body() fixedUserDto: UserAllInfoDto
    ){
        return await this.userService.fixUserAllInfo(userId, fixedUserDto)
    }

    @Delete(':id')
    async deleteUserInfo(@UserId() userId : number){

            return await this.userService.deleteUserInfo(userId)
    }
    
}
