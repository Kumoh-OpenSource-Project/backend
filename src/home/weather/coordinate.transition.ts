// coordinate-conversion.ts

import { Injectable } from '@nestjs/common';
import { CoordinateDto } from './coordinate.dto';

@Injectable()
export class CoordinateTransition {
    private Re = 6371.00877;
    private grid = 5.0;
    private slat1 = 30.0;
    private slat2 = 60.0;
    private olon = 126.0;
    private olat = 38.0;
    private xo = 210 / this.grid;
    private yo = 675 / this.grid;

    private PI = Math.asin(1.0) * 2.0;
    private DEGRAD = this.PI / 180.0;
    private RADDEG = 180.0 / this.PI;

    private first = 0;

    async lamcproj(lon: number, lat: number, x: number, y: number) {
        let re, olon, olat, sn, sf, ro;
        let slat1, slat2, alon, alat, xn, yn, ra, theta;

        if (this.first === 0) {
            this.PI = Math.asin(1.0) * 2.0;
            this.DEGRAD = this.PI / 180.0;
            this.RADDEG = 180.0 / this.PI;

            re = this.Re / this.grid;
            slat1 = this.slat1 * this.DEGRAD;
            slat2 = this.slat2 * this.DEGRAD;
            olon = this.olon * this.DEGRAD;
            olat = this.olat * this.DEGRAD;

            sn = Math.tan(this.PI * 0.25 + slat2 * 0.5) / Math.tan(this.PI * 0.25 + slat1 * 0.5);
            sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
            sf = Math.tan(this.PI * 0.25 + slat1 * 0.5);
            sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
            ro = Math.tan(this.PI * 0.25 + olat * 0.5);
            ro = re * sf / Math.pow(ro, sn);
            this.first = 1;
        }

        ra = Math.tan(this.PI * 0.25 + lat * this.DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        theta = lon * this.DEGRAD - olon;
        if (theta > this.PI) theta -= 2.0 * this.PI;
        if (theta < -this.PI) theta += 2.0 * this.PI;
        theta *= sn;
        x = ra * Math.sin(theta) + this.xo;
        y = ro - ra * Math.cos(theta) + this.yo;
        x = Math.floor(x+1.5);
        y = Math.floor(y+1.5);
        return {x,y};
    }


    async convertCoordinate(dto: CoordinateDto) {
        return this.lamcproj(dto.lon, dto.lat, dto.x, dto.y);
    }
}