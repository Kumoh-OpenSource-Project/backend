import { Body, Controller, Delete, Get, HttpCode, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuthGuard } from 'src/guard/user.auth.guard';
import { UserInfoDto } from 'src/common/dto/user/user.dto';

@UseGuards(UserAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  
    @Get()
    async getAllUsersInfo() {
    return await this.userService.getAllUsersInfo();
    }

    @Get(':id')
    async getUserInfo(@Param('id') serviceId: number) {
        return await this.userService.getOneUserInfo(serviceId);
    }

    @Patch(':id')
    async fixUserInfo(
        @Param('id') serviceId: number, 
        @Body() fixedUserDto: UserInfoDto
    ){
        return await this.userService.fixUserInfo(serviceId, fixedUserDto)
    }

    @Delete(':id')
    async deleteUserInfo(@Param('id') serviceId: number){
            return await this.userService.deleteUserInfo(serviceId)
    }
    
}
