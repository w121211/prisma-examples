import express from 'express'
import { verify } from 'jsonwebtoken'
import { allow, rule, shield } from 'graphql-shield'
import { Context } from './context'

export const APP_SECRET = 'appsecret321'

interface Token {
  userId: string
}

function getUserId(context: Context) {
  // const {token} = context.req.cookies
  // if (token) {
  //   try {
  // 		const {userId} = verify(
  // 			token.replace('Bearer ', ''),
  // 			process.env.APP_SECRET
  // 		);

  // 		context.req.userId = userId;
  // 	} catch (error) {
  // 		context.res.clearCookie('token');
  // 	}
  // }
  const authorization = context.req.headers.authorization
  if (authorization) {
    const token = authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token
    return verifiedToken && verifiedToken.userId
  }
}

const rules = {
  isAuthenticatedUser: rule({ cache: 'contextual' })((parent, args, context) => {
    return Boolean(context.req.userId)
  }),

  // isAuthenticatedUser: rule()((parent, args, context) => {
  //   const userId = getUserId(context)
  //   // context.req["userId"] = userId
  //   context.req.userId = userId
  //   return Boolean(userId)
  // })

  // isPostOwner: rule()(async (parent, { id }, context) => {
  //   const userId = getUserId(context)
  //   const author = await context.prisma.post
  //     .findOne({
  //       where: {
  //         id,
  //       },
  //     })
  //     .author()
  //   return userId === author.id
  // }),
}

export function authorization(): express.RequestHandler {
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

// const isAuthenticated = rule({ cache: 'contextual' })((parent, args, context) => {
//   return Boolean(context.request.userId)
// })

export const permissions = shield({
  Query: {
    // '*': isAuthenticated
    me: rules.isAuthenticatedUser,
    // filterPosts: rules.isAuthenticatedUser,
    // post: rules.isAuthenticatedUser,
  },
  Mutation: {
    // '*': rules.isAuthenticatedUser,
    login: allow,
    signup: allow
    // createDraft: rules.isAuthenticatedUser,
    // deletePost: rules.isPostOwner,
    // publish: rules.isPostOwner,
  },
}, {
  allowExternalErrors: true
})
