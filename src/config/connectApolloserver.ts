import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express from 'express';
import { createServer } from 'http';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { UserResolver, Hello } from '../graphql/resolvers/index';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const httpServer = createServer(app);
export const connectApolloServer = async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [Hello, UserResolver],
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORTAPOLOSERVER }, resolve as () => void),
  );
  // http://localhost:8000/graphql
  console.log(
    `Server grapql on localhost  http://localhost:${process.env.PORTAPOLOSERVER}/${apolloServer.graphqlPath}`,
  );
};
