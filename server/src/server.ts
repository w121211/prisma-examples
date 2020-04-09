
import express from 'express'
import cookieParser from 'cookie-parser'
import { applyMiddleware } from 'graphql-middleware'
import { ApolloServer } from 'apollo-server-express'
import faker from 'faker'

// const { authorization } = require('./lib/middlewares/authorization');
import { createContext } from './context'
import { schema as baseSchema } from './schema'
import { permissions, authorization } from './permissions'

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string
  }
}

const app = express()
app.use(cookieParser())
app.use(authorization())

console.log(faker.lorem.sentence())

const mocks = {
  ID: faker.random.uuid,
  Int: faker.random.number,
  Float: () => 22.1,
  // String: faker.lorem.sentence,
  String: () => faker.lorem.sentence(),
  DateTime: () => '2007-12-03T10:15:30Z'
}

// const schema = applyMiddleware(baseSchema, permissions)
const server = new ApolloServer({
  // schema,
  schema: baseSchema,
  context: createContext,
  // context: ({ req, res }) => ({
  //   request: req,
  //   response: res,
  //   prisma,
  // }),
  playground: {
    settings: {
      "request.credentials": "include"  // for cookies
    }
  },
  // mocks: true,
  mocks
})

server.applyMiddleware({ app, path: '/' })
// server.applyMiddleware({ app })   

// module.exports = { app };
// export { app }
app.listen(4000, () => console.log(`Listening on http://localhost:4000/`));
