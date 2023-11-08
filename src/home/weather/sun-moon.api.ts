import { Injectable } from "@nestjs/common";

@Injectable()
export class SunMoonAPI{
  private readonly SUN_KEY = process.env.SUN_API;

  async getSun(){
    
  }

  converTimeZone(){
    const utcDate = new Date("2023-11-08T21:55:20+00:00");
    utcDate.setHours(utcDate.getHours() + 9);
    const koreanTime = utcDate.toLocaleString("ko-KR");
    console.log(koreanTime);
  }
}