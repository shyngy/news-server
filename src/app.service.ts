import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getUsers(id: number) {
    return `hello user is number${id}`;
  }
}
