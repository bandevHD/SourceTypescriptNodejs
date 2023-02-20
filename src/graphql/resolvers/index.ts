import { Hello } from './hello';
import { UserResolver } from './User';

const resolvers = [UserResolver, Hello];

export default resolvers;
export { UserResolver, Hello };
