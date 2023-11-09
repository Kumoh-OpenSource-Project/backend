export class TodayWeatehrDto{
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  weathers: TodayTimeDto[];
}

export class TodayTimeDto{
  fcstTime: string;
  temp: number;
  humidity: number;
  sky: number;
  pty: number;
  // icon: string;
}