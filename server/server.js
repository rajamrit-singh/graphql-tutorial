import cors from 'cors';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import { readFile } from 'node:fs/promises';
import { resolvers } from './resolvers.js';
import { getUser } from './db/users.js';
import { createCompanyLoader } from './db/companies.js';

// Defining the port number to be used for the server
const PORT = 9000;

// Creating an instance of the express application
const app = express();

// Applying middleware to the express app - 'cors()' for CORS support, 'express.json()' for parsing JSON requests, and 'authMiddleware' for custom authentication handling
app.use(cors(), express.json(), authMiddleware);

// Handling POST requests to the '/login' endpoint using the 'handleLogin' function
app.post('/login', handleLogin);

// Read the GraphQL schema from the file
const typeDefs = await readFile('./schema.graphql', 'utf8');

// Creating an instance of ApolloServer with typeDefs and resolvers
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// Starting the Apollo Server
await apolloServer.start();

async function getContext({ req }) {
  const companyLoader = createCompanyLoader();
  const context = { companyLoader };
  if (req.auth) {
    context.user = await getUser(req.auth.sub);
  }
  return context;
}

// Applying Apollo Server middleware to the express app at the '/graphql' endpoint
app.use('/graphql', apolloMiddleware(apolloServer, { context: getContext }));
/*

The line app.use('/graphql', apolloMiddleware(apolloServer)); is configuring the Express
application to use Apollo Server middleware at the specified endpoint '/graphql'. 

app.use('/graphql', ...): This is an Express method that specifies middleware to be used
for a specific route. In this case, it's saying that the middleware specified should be
used for any incoming requests to the '/graphql' endpoint.

apolloServer: This is the instance of Apollo Server that is created earlier in your
code (const apolloServer = new ApolloServer({});). The apolloMiddleware function takes this instance as an argument.

When you pass apolloServer to apolloMiddleware(apolloServer), you're essentially configuring
the middleware to work with that specific instance of Apollo Server. This is important because it
allows the middleware to understand how to handle GraphQL requests based on the configuration and schema provided to that Apollo Server instance.
*/
// Starting the express app to listen on the specified port, and logging a message once the server is running
app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
