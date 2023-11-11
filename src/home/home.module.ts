import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { WeatherService } from './weather/weather.service';
import { WeatherProcessor } from './weather/weather.processor';
import { CoordinateTransition } from './weather/api/coordinate.transition';
import { SunMoonAPI } from './weather/api/sun-moon.api';
import { AstroAPI } from './weather/api/astro.api';

@Module({
  controllers: [HomeController],
  providers: [HomeService, WeatherService, WeatherProcessor, CoordinateTransition, SunMoonAPI, AstroAPI],
})
export class HomeModule {}
