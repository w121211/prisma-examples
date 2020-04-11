import { readFileSync } from 'fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: ['query', 'info', 'warn'],
})

async function main() {
  await prisma.raw('TRUNCATE "User", "Feed", "FeedLike" CASCADE;')
  const user1 = await prisma.user.create({
    data: {
      email: 'aaa@aaa.com',
      password: 'aaa',
      profile: { create: {} },
      dailyProfile: { create: {} }
    }
  })
  const user2 = await prisma.user.create({
    data: {
      email: 'bbb@bbb.com',
      password: 'bbb',
      profile: { create: {} },
      dailyProfile: { create: {} }
    }
  })
  const feed1 = await prisma.feed.create({
    data: {
      header: "feed header 1",
      user: { connect: { id: user1.id } },
      count: { create: {} }
    }
  })
  const feed2 = await prisma.feed.create({
    data: {
      header: "feed header 2",
      user: { connect: { id: user2.id } },
      count: { create: {} }
    }
  })
  const like1 = await prisma.feedLike.create({
    data: {
      choice: 0,
      user: { connect: { id: "" } },
      feed: { connect: { id: feed1.id } },
    }
  })
  await prisma.feedLike.upsert({
    where: {
      userId_feedId: {
        userId: user1.id,
        feedId: feed1.id,
      }
    },
    update: {
      choice: 1,
    },
    create: {
      choice: 1,
      user: { connect: { id: user1.id } },
      feed: { connect: { id: feed1.id } },
    }
  })

  console.log(
    // await prisma.feed
    //   .findMany({
    //     where: {
    //       id: feed1.id,
    //       // id: 1234,
    //       // user: { id: user1.id }
    //       user: { id: "asijodij" }
    //     },
    //     select: { id: true }
    //   })

  )


  // await prisma.user.findOne()

  // const user1 = await prisma.user.create({
  //   data: {
  //     email: 'alice@prisma.io',
  //     name: 'Alice',
  //     posts: {
  //       create: {
  //         title: 'Join us for GraphQL Conf 2019 in Berlin',
  //         content: 'https://www.graphqlconf.org/',
  //         published: true,
  //       },
  //     },
  //   },
  // })
  // const user2 = await prisma.user.create({
  //   data: {
  //     email: 'bob@prisma.io',
  //     name: 'Bob',
  //     posts: {
  //       create: [
  //         {
  //           title: 'Subscribe to GraphQL Weekly for community news',
  //           content: 'https://graphqlweekly.com/',
  //           published: true,
  //         },
  //         {
  //           title: 'Follow Prisma on Twitter',
  //           content: 'https://twitter.com/prisma/',
  //           published: false,
  //         },
  //       ],
  //     },
  //   },
  // })
  // const ticker1 = await prisma.ticker.create({
  //   data: {
  //     name: "AADR",
  //     body: "this is a body",
  //     valid: true,
  //   }
  // })

  // const ticks = readFileSync('./prisma/aadr.us.txt', 'utf-8').split('\r\n')
  // for (let i = 1; i < ticks.length; i++) {

  //   const d = ticks[i].split(',')
  //   await prisma.tick.create({
  //     data: {
  //       ticker: { connect: { id: ticker1.id } },
  //       value: parseFloat(d[4]),
  //       at: new Date(d[0])
  //     }
  //   })
  // }

  // console.log({ user1, user2 })
  // console.log(ticker1, tick)
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.disconnect()
  })
