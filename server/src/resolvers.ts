import { GraphQLResolverMap } from 'apollo-graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import { Context } from './context'

export const resolvers: GraphQLResolverMap<Context> = {
    DateTime: GraphQLDateTime, // custom scalars
    Query: {
        feed: (parent, { id }, ctx) => {
            return ctx.prisma.feed.findOne({ where: { id } })
        },
        feeds: (parent, { after = null }, { prisma }) => {
            // TODO: 改用cache做判段，不直接連結
            // return ctx.prisma.feed.findMany({ "after": { id: after } })
            return prisma.feed.findMany({ first: 5 })
        },

        // filterPosts: (parent, args, ctx) => {
        //     return ctx.prisma.post.findMany({
        //         where: {
        //             OR: [
        //                 { title: { contains: args.searchString } },
        //                 { content: { contains: args.searchString } },
        //             ],
        //         },
        //     })
        // },
        // post: (parent, args, ctx) => {
        //     return ctx.prisma.post.findOne({
        //         where: { id: Number(args.where.id) },
        //     })
        // },
    },
    Mutation: {
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
        // signupUser: (parent, args, ctx: Context) => {
        //     return ctx.prisma.user.create(args)
        // },
    },
    Feed: {
        stats: (parent, args, { prisma }) => {
            return prisma.feed.findOne({
                where: { id: parent.id },
            }).stats()
        },
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