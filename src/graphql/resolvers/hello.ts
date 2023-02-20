import { Query, Resolver } from 'type-graphql';

@Resolver()
export class Hello {
  @Query()
  hello(): string {
    return 'hello world';
  }
}
