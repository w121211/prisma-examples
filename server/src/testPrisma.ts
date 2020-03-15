import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function mock() {
  // const result = await prisma.raw('SELECT * FROM User;')
  // await prisma.user.deleteMany({ where: { email: "aaa@aaa.com" } })
  // await prisma.feed.deleteMany()

  const user1 = await prisma.user.create({
    data: {
      email: "aaa@aaa.com",
      password: "aaabbbccc"
    }
  })
  const user2 = await prisma.user.create({
    data: {
      email: "bbb@bbb.com",
      password: "aaabbbccc"
    }
  })
  const feed1 = await prisma.feed.create({
    data: {
      user: { connect: { email: "aaa@aaa.com" } },
      header: "this is a header",
      stats: {
        create: {
          nViews: 100,
          nVoteUps: 11,
          nVoteDowns: 22,
        }
      }
    }
  })
  const feed2 = await prisma.feed.create({
    data: {
      user: { connect: { email: "aaa@aaa.com" } },
      header: "this is a header",
      stats: {
        create: {
          nViews: 100,
          nVoteUps: 11,
          nVoteDowns: 22,
        }
      }
    }
  })

  // const feed1 = await prisma.feed.create({
  //   data: {
  //     user: {
  //       connect: {
  //         id: user1.id
  //       }
  //     },
  //     header: "this is a header",
  //     // post      Post?
  //     // webpage   Webpage?
  //     // event    Event?
  //     // tags      Tag[]
  //     // commments Comment[]
  //     // tickers  Ticker[]
  //     // comments Comment[]
  //     // feedType FeedType
  //     stats: {
  //       create: {
  //         nViews: 100,
  //         nVoteUps: 11,
  //         nVoteDowns: 22,
  //       }
  //     }
  //   }
  // })


  // await prisma.feed.deleteMany({ where: { header: "this is a header" } })



  // console.log(feed1)

}

// Seed the database with users and posts
// const user1 = await prisma.user.create({
//     data: {
//         email: 'alice@prisma.io',
//         name: 'Alice',
//         posts: {
//             create: {
//                 title: 'Watch the talks from Prisma Day 2019',
//                 content: 'https://www.prisma.io/blog/z11sg6ipb3i1/',
//                 published: true,
//             },
//         },
//     },
//     include: {
//         posts: true,
//     },
// })
// const user2 = await prisma.user.create({
//     data: {
//         email: 'bob@prisma.io',
//         name: 'Bob',
//         posts: {
//             create: [
//                 {
//                     title: 'Subscribe to GraphQL Weekly for community news',
//                     content: 'https://graphqlweekly.com/',
//                     // published: true,
//                 },
//                 {
//                     title: 'Follow Prisma on Twitter',
//                     content: 'https://twitter.com/prisma/',
//                     // published: false,
//                 },
//             ],
//         },
//     },
//     include: {
//         posts: true,
//     },
// })
// console.log(`Created users: ${user1.name} (${user1.posts.length} post) and (${user2.posts.length} posts) `)

// // Retrieve all published posts
// const allPosts = await prisma.post.findMany({
//     where: { published: true },
// })
// console.log(`Retrieved all published posts: `, allPosts)

// // Create a new post (written by an already existing user with email alice@prisma.io)
// const newPost = await prisma.post.create({
//     data: {
//         title: 'Join the Prisma Slack community',
//         content: 'http://slack.prisma.io',
//         published: false,
//         author: {
//             connect: {
//                 email: 'alice@prisma.io',
//             },
//         },
//     },
// })
// console.log(`Created a new post: `, newPost)

// // Publish the new post
// const updatedPost = await prisma.post.update({
//     where: {
//         id: newPost.id,
//     },
//     data: {
//         published: true,
//     },
// })
// console.log(`Published the newly created post: `, updatedPost)

// // Retrieve all posts by user with email alice@prisma.io
// const postsByUser = await prisma.user
//     .findOne({
//         where: {
//             email: 'alice@prisma.io',
//         },
//     })
//     .posts()
// console.log(`Retrieved all posts from a specific user: `, postsByUser)
// }

async function test() {
  const result = await prisma.raw('DROP TABLE User;')
  // console.log(result)

  const user1 = await prisma.user.findOne({
    where: { email: "aaa@aaa.com" }
  })
  // const feed1 = await prisma.feed.findOne({
  //   where: { id: 1 },
  //   include: { stats: true }
  // })
  // // .stats()
  // // const stats = await feed1.stats()

  // console.log(user1)
  // // console.log(feed1.stats())
  // console.log(feed1)
}

async function main() {
  await mock()
  // await test()
}

main()
  .catch(e => { throw e })
  .finally(async () => { await prisma.disconnect() })