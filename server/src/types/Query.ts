import { idArg, queryType, stringArg, inputObjectType } from 'nexus'
// import { getUserId } from '../utils'

export const Query = queryType({
  definition(t) {
    // t.crud.feed()
    t.crud.feeds({ ordering: { createdAt: true } })

    // t.list.field('feeds', {
    //   type: 'Feed',
    //   args: { after: stringArg(), userId: idArg() },
    //   // resolve: async (parent, { after, userId }, ctx) => {
    //   //   const feeds = await ctx.prisma.feed.findMany({ after })
    //   //   feeds.map(feed => {
    //   //     feed.votes
    //   //   })
    //   //   return feeds
    //   // }
    // })

    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.user.findOne({
          where: {
            id: Number(userId),
          },
        })
      },
    })

    // t.list.field('feed', {
    //   type: 'Post',
    //   resolve: (parent, args, ctx) => {
    //     return ctx.prisma.post.findMany({
    //       where: { published: true },
    //     })
    //   },
    // })

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (parent, { searchString }, ctx) => {
        return ctx.prisma.post.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: searchString,
                },
              },
              {
                content: {
                  contains: searchString,
                },
              },
            ],
          },
        })
      },
    })

    t.field('post', {
      type: 'Post',
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.post.findOne({
          where: {
            id: Number(id),
          },
        })
      },
    })
  },
})
