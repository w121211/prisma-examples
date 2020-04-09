import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { GraphQLResolverMap } from 'apollo-graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import { Context } from './context'
import { APP_SECRET } from './permissions'

export const resolvers: GraphQLResolverMap<Context> = {
    DateTime: GraphQLDateTime, // custom scalars
    Query: {
        me: (parent, args, { prisma, req }) => {
            const userId = req.userId
            return prisma.user.findOne({ where: { id: userId } })
        },
        feed: (parent, { id }, ctx) => {
            return ctx.prisma.feed.findOne({ where: { id } })
        },
        feeds: (parent, { after = null }, { prisma }) => {
            // TODO: 改用cache做判段，不直接連結
            // return ctx.prisma.feed.findMany({ "after": { id: after } })
            return prisma.feed.findMany({ first: 5 })
        },
    },
    Mutation: {
        signup: async (parent, { email, password }, { prisma }) => {
            const hashedPassword = await hash(password, 10)
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            })
            return {
                token: sign({ userId: user.id }, APP_SECRET),
                user,
            }
        },
        login: async (parent, { email, password }, { prisma, res }) => {
            const user = await prisma.user.findOne({
                where: { email }
            })
            if (!user) {
                throw new Error('Could not find a match for username and password')
            }
            const valid = await compare(password, user.password)
            if (!valid) {
                throw new Error('Could not find a match for username and password')
            }
            const token = sign({ userId: user.id }, APP_SECRET)
            res.cookie('token', `Bearer ${token}`, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
                // secure: true,  // https only
            })
            return { token, user }
        },
        createComment: (parent, { data }, { prisma, req }) => {
            return prisma.comment.create({ userId: req.userId, ...data })
        },
        updateComment: (parent, { id, data }, { prisma, req }) => {
            return prisma.comment.update({
                where: { id: Number(id) },
                data
            })
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
    Feed: {
        // event: (parent, args, { prisma }) => {
        //     return prisma.feed.findOne({
        //         where: { id: parent.id },
        //     }).event()
        // },
        // tags: (parent, args, { prisma }) => {
        //     return prisma.feed.findOne({
        //         where: { id: parent.id },
        //     }).tags()
        // },
        // tickers: (parent, args, { prisma }) => {
        //     return prisma.feed.findOne({
        //         where: { id: parent.id },
        //     }).tickers()
        // },
        // comments: (parent, args, { prisma }) => {
        //     return prisma.feed.findOne({
        //         where: { id: parent.id },
        //     }).comments()
        // },
        // stats: (parent, args, { prisma }) => {
        //     return prisma.feed.findOne({
        //         where: { id: parent.id },
        //     }).stats()
        // },
    },
    Comment: {
        // stats: (parent, args, { prisma }) => {
        //     return prisma.comment.findOne({
        //         where: { id: parent.id },
        //     }).stats()
        // }
    }
    // User: {
    //     posts: (parent, args, ctx: Context) => {
    //         return ctx.prisma.user
    //             .findOne({
    //                 where: { id: parent.id },
    //             })
    //             .posts()
    //     },
    // },
    // Post: {
    //     author: (parent, args, ctx: Context) => {
    //         return ctx.prisma.post
    //             .findOne({
    //                 where: { id: parent.id },
    //             })
    //             .author()
    //     },
    // },
}