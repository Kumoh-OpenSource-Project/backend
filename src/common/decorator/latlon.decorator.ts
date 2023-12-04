import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PositiveCoordinate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let { lat, lon } = request.query;
    lat = lat < 0 ? -lat : lat;
    lon = lon < 0 ? -lon : lon;
    return { lat, lon };
  },
);
