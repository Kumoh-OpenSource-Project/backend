import { Injectable } from '@nestjs/common';

@Injectable()
export class CoordinateTransition {
    
    
    lamcproj(lon: number, lat: number) {
        const PI = Math.asin(1.0) * 2.0;
        const DEGRAD = PI / 180.0;
        const RADDEG = 180.0 / PI;
        let first = 0;
        let Re = 6371.00877;
        let grid = 5.0;
        let slat1 = 30.0;
        let slat2 = 60.0;
        let olon = 126.0;
        let olat = 38.0;
        let xo = 210 / grid;
        let yo = 675 / grid;

        if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
            throw new Error('lon should be in the range of -180 to 180 and lat should be in the range of -90 to 90');
        }
        
        let sn, sf, ro;
        let alon, alat, xn, yn, ra, theta;
        let x = 0;
        let y = 0;

        const re = Re / grid;
        slat1 = slat1 * DEGRAD;
        slat2 = slat2 * DEGRAD;
        olon = olon * DEGRAD;
        olat = olat * DEGRAD;

        sn = Math.tan(PI * 0.25 + slat2 * 0.5) / Math.tan(PI * 0.25 + slat1 * 0.5);
        sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
        sf = Math.tan(PI * 0.25 + slat1 * 0.5);
        sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
        ro = Math.tan(PI * 0.25 + olat * 0.5);
        ro = re * sf / Math.pow(ro, sn);
        first = 1;

        ra = Math.tan(PI * 0.25 + lat * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        theta = lon * DEGRAD - olon;
        if (theta > PI) theta -= 2.0 * PI;
        if (theta < -PI) theta += 2.0 * PI;
        theta *= sn;
        x = ra * Math.sin(theta) + xo;
        y = ro - ra * Math.cos(theta) + yo;
        x = Math.floor(x+1.5);
        y = Math.floor(y+1.5);
        if( x > 110 ){
            x = 85;
        }
        if (y > 160){
            y = 96;
        }
        return {x,y};
    }

}