import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { WeatherService } from './weather/weather.service';
import { WeatherProcessor } from './weather/weather.processor';
import { CoordinateTransition } from './weather/coordinate.transition';

@Module({
  controllers: [HomeController],
  providers: [HomeService, WeatherService, WeatherProcessor, CoordinateTransition],
})
export class HomeModule {}
