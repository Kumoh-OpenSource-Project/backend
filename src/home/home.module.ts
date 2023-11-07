import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { WeatherService } from './weather/weather.service';
import { WeatherProcessor } from './weather/weather.processor';

@Module({
  controllers: [HomeController],
  providers: [HomeService, WeatherService, WeatherProcessor],
})
export class HomeModule {}
