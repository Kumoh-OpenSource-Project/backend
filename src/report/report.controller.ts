import { Controller, Post, Body, UseGuards, ValidationPipe, Delete, Query, Param, BadRequestException, Get } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UserId } from 'src/common/decorator/user.id.decorator';
import { UserAuthGuard } from 'src/guard/user.auth.guard';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}


  @UseGuards(UserAuthGuard)
  @Post()
  async create(
    @Body(ValidationPipe) createReportDto: CreateReportDto,
    @UserId() userId: number
    ) {
    return await this.reportService.create(createReportDto, userId);
  }

  //slack에서 바로 삭제해야 하기 때문에 어쩔 수 없이 GET Method 사용했음.
  @Get()
  async delete(
    @Query('resource') resource: string,
    @Query('id') id : number,
  ){
      return await this.reportService.deleteContent(resource, id);
    }
  

}
