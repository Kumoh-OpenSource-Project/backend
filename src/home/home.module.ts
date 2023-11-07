import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { HomeWeatherService } from './home.weather.service';

@Module({
  controllers: [HomeController],
  providers: [HomeService, HomeWeatherService],
})
export class HomeModule {}
