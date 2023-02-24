import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { expressInterface, middleWareAuhth } from '../middleware/simpleMiddleware';

@Resolver()
export class Hello {
  @Query()
  @UseMiddleware(middleWareAuhth)
  hello(@Ctx() context: expressInterface): string {
    return 'hello world';
  }
}
