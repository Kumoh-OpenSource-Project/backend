import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  async (_, context: ExecutionContext): Promise<number> => {
      return  context.switchToHttp().getRequest().userId;
    } 
);