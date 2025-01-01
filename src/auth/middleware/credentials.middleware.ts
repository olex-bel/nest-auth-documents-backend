import { Injectable, NestMiddleware } from '@nestjs/common';
import { CredentialsUserDto } from '../dto/credentials-user.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CredentialsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const userDto: CredentialsUserDto = plainToClass(CredentialsUserDto, req.body);
    validate(userDto, { skipMissingProperties: false }).then(errors => {
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
      next();
    });
  }
}
