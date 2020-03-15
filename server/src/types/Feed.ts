import { objectType } from 'nexus'

export const Feed = objectType({
  name: 'Feed',
  definition(t) {
    t.model.id()
    t.model.post()
    t.model.title()
    t.model.user()
    t.model.stats()
    t.int('meVote', { nullable: true })
    // t.field('meVote', {
    //   type: 'FeedVote',
    //   nullable: true,
    //   resolve: async (parent, args, ctx) => {
    //     const id = Number(args.where.id)
    //     return ctx.prisma.feedVote.findOne({
    //       where: { feed: id },
    //     })
    //   },
    //   // async resolve(_parent, _args, ctx) {
    //   //   const databaseInfo = await ctx.prisma.someModel.someOperation(...)
    //   //   const result = doSomething(databaseInfo)
    //   //   return result
    //   // }
    // })
  },
})
