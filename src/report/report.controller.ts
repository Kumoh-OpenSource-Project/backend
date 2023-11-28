import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UserId } from 'src/common/decorator/user.id.decorator';
import { UserAuthGuard } from 'src/guard/user.auth.guard';

@UseGuards(UserAuthGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(
    @Body() createReportDto: CreateReportDto,
    @UserId() userId: number
    ) {
    return await this.reportService.create(createReportDto, userId);
  } 
}
