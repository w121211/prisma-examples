import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { GraphQLResolverMap } from 'apollo-graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import { Context } from './context'
import { APP_SECRET } from './server'

export const resolvers: GraphQLResolverMap<Context> = {
  DateTime: GraphQLDateTime, // custom scalar
  Query: {
    newPosts: (parent, { after = null }, { prisma }) => {
      return prisma.post.findMany({
        first: 20,
        include: { count: true },
      })
    },
    risingPosts: (parent, args, ctx) => {
      return []
    },
    trendPosts: (parent, args, ctx) => {
      return []
    },
    post: (parent, { id }, { prisma }) => {
      return prisma.post.findOne({
        where: { id }
      })
    },
    comments: (parent, { postId, after }, { prisma }) => {
      return prisma.comment.findMany({ where: { postId }, first: 20 })
    },
    symbol: (parent, { id, slug }, { prisma }) => {
      return prisma.symbol.findOne({ where: { id, slug } })
    },
    ticks: (parent, { symbolId, after }, ctx) => {
      return ctx.prisma.tick.findMany({ where: { symbolId }, first: 50 })
    },
    me: (parent, args, { prisma, req }) => {
      return prisma.user.findOne({ where: { id: req.userId } })
    },
    myPostLikes: (parent, args, { prisma, req }) => {
      return prisma.postLike.findMany({ where: { userId: req.userId }, first: 50 })
    },
    myFollows: (parent, args, { prisma, req }) => {
      return prisma.follow.findMany({ where: { userId: req.userId, followed: true }, first: 50 })
    },
    // myCommitReviews: (parent, args, { prisma, req }) => {
    //   const userId = req.userId
    //   return prisma.user.findOne({ where: { id: userId } })
    // },
  },
  Mutation: {
    signup: async (parent, { email, password }, { prisma, res }) => {
      res.clearCookie('token')
      const hashedPassword = await hash(password, 10)
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          profile: { create: {} },
          dailyProfile: { create: {} },
        },
      })
      return {
        token: sign({ userId: user.id }, APP_SECRET),
        user,
      }
    },
    login: async (parent, { email, password }, { prisma, res }) => {
      const user = await prisma.user.findOne({
        where: { email },
      })
      if (!user)
        throw new Error('Could not find a match for username and password')

      const valid = await compare(password, user.password)
      if (!valid)
        throw new Error('Could not find a match for username and password')

      const token = sign({ userId: user.id }, APP_SECRET)
      res.cookie('token', `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        // secure: true,  // https only
      })
      return { token, user }
    },
    logout: (parent, { email, password }, { prisma, res }) => {
      res.clearCookie('token')
      return true
    },
    fetchPage: (parent, { link }, { prisma, req }) => {
      // grpc call to nlp-app
      // return prisma.comment.create({ userId: req.userId, ...data })
      return null
    },
    createPost: (parent, { data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    updatePost: (parent, { id, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    createPostLike: (parent, { postId, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    updatePostLike: (parent, { postId, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    createPostVote: (parent, { postId, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    updatePostVote: (parent, { postId, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    createComment: (parent, { data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    updateComment: (parent, { id, data }, { prisma, req }) => {
      return prisma.comment.update({
        where: { id: Number(id) },
        data,
      })
    },
    createCommentLike: (parent, { postId, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    updateCommentLike: (parent, { postId, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    createCommit: (parent, { data }, { prisma, req }) => {
      // invite random reviewers by creating commitReview

      return prisma.comment.create({ userId: req.userId, ...data })
    },
    updateCommit: (parent, { id, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    updateCommitReview: (parent, { id, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    applyCommitReview: (parent, { id, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    createFollow: (parent, { symbolId, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    updateFollow: (parent, { symbolId, data }, { prisma, req }) => {
      return prisma.comment.create({ userId: req.userId, ...data })
    },
    // upsertEventTrack: (parent, { id, eventId, isTracked }, { prisma, req }) => {
    //     const data = { userId: req.userId, eventId, isTracked }
    //     if (id == null) {
    //         return prisma.eventTrack.create({ data })
    //     } else {
    //         return prisma.eventTrack.update({
    //             where: { id: Number(id) },
    //             data,
    //         })
    //     }
    // },

    // myLikes: (parent, args, { prisma, req }) => {
    //     const userId = req.userId
    //     return prisma.like.findMany({
    //         where: { userId: Number(userId) },
    //         first: 100,
    //     })
    // },

    // createDraft: (parent, args, ctx) => {
    //     return ctx.prisma.post.create({
    //         data: {
    //             title: args.title,
    //             content: args.content,
    //             published: false,
    //             author: {
    //                 connect: { email: args.authorEmail },
    //             },
    //         },
    //     })
    // },
    // deleteOnePost: (parent, args, ctx: Context) => {
    //     return ctx.prisma.post.delete({
    //         where: { id: Number(args.where.id) },
    //     })
    // },
    // publish: (parent, args, ctx: Context) => {
    //     return ctx.prisma.post.update({
    //         where: { id: Number(args.id) },
    //         data: { published: true },
    //     })
    // },
  },
}
