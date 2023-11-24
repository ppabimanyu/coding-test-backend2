import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const req = context.switchToHttp().getRequest();
    return req.user.userId;
  },
);
