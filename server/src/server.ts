
import express from 'express'
import cookieParser from 'cookie-parser'
import { verify } from 'jsonwebtoken'
import { applyMiddleware } from 'graphql-middleware'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import { makeExecutableSchema } from 'graphql-tools'
import faker from 'faker'

// const { authorization } = require('./lib/middlewares/authorization');
import { createContext } from './context'
// import { schema as baseSchema } from './schema'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { permissions } from './permissions'

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string
  }
}

interface Token {
  userId: string
}

export const APP_SECRET = 'appsecret321'

// Reference: https://github.com/maticzav/graphql-shield/blob/master/examples/with-graphql-nexus/src/lib/middlewares/authorization.js
function authorization(): express.RequestHandler {
  return function (req, res, next) {
    // console.log(req.cookies)
    const { token } = req.cookies
    if (!token) return next()
    try {
      const verifiedToken = verify(
        token.replace("Bearer ", ""), APP_SECRET) as Token
      req.userId = verifiedToken.userId
      // const verifiedToken = verify(
      //   token.replace('Bearer ', ''),
      //   process.env.APP_SECRET || ""
      // ) as Token
      // req.userId = verifiedToken && verifiedToken.userId
    } catch (error) {
      res.clearCookie('token')
    }
    return next()
  }
}


const app = express()
app.use(cookieParser())
app.use(authorization())

const mocks = {
  ID: faker.random.uuid,
  Int: faker.random.number,
  Float: () => 22.1,
  // String: faker.lorem.sentence,
  String: () => faker.lorem.sentence(),
  DateTime: () => '2007-12-03T10:15:30Z'
}

// const logError: ApolloServerPlugin = {
//   requestDidStart(requestContext) {
//     return {
//       parsingDidStart() {
//         return (err) => {
//           if (err) console.error(err)
//         }
//       },
//       validationDidStart() {
//         return (err) => {
//           if (err) console.error(err)
//         }
//       },
//       executionDidStart() {
//         return (err) => {
//           if (err) console.error(err)
//         }
//       }
//     }
//   },
// }

const baseSchema = makeExecutableSchema({ typeDefs, resolvers })
const schema = applyMiddleware(baseSchema, permissions)
const server = new ApolloServer({
  schema,
  typeDefs,
  resolvers,
  context: createContext,
  // context: ({ req, res }) => ({
  //   request: req,
  //   response: res,
  //   prisma,
  // }),
  // dataSources: {},
  playground: {
    settings: {
      "request.credentials": "include"  // for cookies
    }
  },
  // mocks: true,
  // mocks
  debug: true,
  // plugins: [ logError],
  formatError: (err) => {
    console.error(err)
    return err
  },
})

server.applyMiddleware({ app, path: '/' })
// server.applyMiddleware({ app })   

// module.exports = { app };
// export { app }
app.listen(4000, () => console.log(`Listening on http://localhost:4000/`));
