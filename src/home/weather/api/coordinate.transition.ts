import { Injectable } from '@nestjs/common';

@Injectable()
export class CoordinateTransition {
    private PI = Math.asin(1.0) * 2.0;
    private DEGRAD = this.PI / 180.0;
    private RADDEG = 180.0 / this.PI;

    
    lamcproj(lon: number, lat: number) {
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
        
        let re, sn, sf, ro;
        let alon, alat, xn, yn, ra, theta;
        let x = 0;
        let y = 0;

        if (first === 0) {
            this.PI = Math.asin(1.0) * 2.0;
            this.DEGRAD = this.PI / 180.0;
            this.RADDEG = 180.0 / this.PI;

            re = Re / grid;
            slat1 = slat1 * this.DEGRAD;
            slat2 = slat2 * this.DEGRAD;
            olon = olon * this.DEGRAD;
            olat = olat * this.DEGRAD;

            sn = Math.tan(this.PI * 0.25 + slat2 * 0.5) / Math.tan(this.PI * 0.25 + slat1 * 0.5);
            sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
            sf = Math.tan(this.PI * 0.25 + slat1 * 0.5);
            sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
            ro = Math.tan(this.PI * 0.25 + olat * 0.5);
            ro = re * sf / Math.pow(ro, sn);
            first = 1;
        }

        ra = Math.tan(this.PI * 0.25 + lat * this.DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        theta = lon * this.DEGRAD - olon;
        if (theta > this.PI) theta -= 2.0 * this.PI;
        if (theta < -this.PI) theta += 2.0 * this.PI;
        theta *= sn;
        x = ra * Math.sin(theta) + xo;
        y = ro - ra * Math.cos(theta) + yo;
        x = Math.floor(x+1.5);
        y = Math.floor(y+1.5);
        return {x,y};
    }

}