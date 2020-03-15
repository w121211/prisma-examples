
import { verify } from 'jsonwebtoken'
import express from 'express'
import cookieParser from 'cookie-parser'
import { applyMiddleware } from 'graphql-middleware'
import { ApolloServer } from 'apollo-server-express'

// const { authorization } = require('./lib/middlewares/authorization');
import { createContext } from './context'
import { schema as baseSchema } from './schema'
import { permissions, APP_SECRET } from './permissions'

interface Token {
  userId: string
}

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string
  }
  // interface Response {
  //   myField?: string
  // }
}


function authorization(): express.RequestHandler {
  return function (req, res, next) {
    // console.log(req.cookies)
    const { token } = req.cookies
    if (!token) {
      return next()
    }

    try {
      const verifiedToken = verify(token.replace("Bearer ", ""), APP_SECRET) as Token
      // const verifiedToken = verify(
      //   token.replace('Bearer ', ''),
      //   process.env.APP_SECRET || ""
      // ) as Token
      req.userId = verifiedToken && verifiedToken.userId
    } catch (error) {
      res.clearCookie('token')
    }

    return next();
  };
}

const app = express()

app.use(cookieParser())
app.use(authorization())

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
  mocks: true,
})

server.applyMiddleware({ app, path: '/' })
// server.applyMiddleware({ app })   

// module.exports = { app };
// export { app }
app.listen(4000, () => console.log(`Listening on http://localhost:4000/`));
