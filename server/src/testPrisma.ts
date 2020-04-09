import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient({ errorFormat: 'minimal' })
const prisma = new PrismaClient()

async function mock() {
  const result = await prisma.raw('TRUNCATE "User", "Feed" CASCADE;')
  // await prisma.user.deleteMany()
  // await prisma.feed.deleteMany()

  const users = await Promise.all([
    {
      email: "aaa@aaa.com",
      password: "aaa"
    },
    {
      email: "bbb@bbb.com",
      password: "bbb"
    },
    {
      email: "ccc@ccc.com",
      password: "ccc"
    },
  ].map(d => prisma.user.create({ data: d })))

  const feeds = await Promise.all([
    {
      user: { connect: { id: users[0].id } },
      header: "header1",
      stats: {
        create: {
          nViews: 100,
          nVoteUps: 11,
          nVoteDowns: 22,
        }
      }
    },
    {
      user: { connect: { id: users[1].id } },
      header: "header2",
      stats: {
        create: {
          nViews: 100,
          nVoteUps: 11,
          nVoteDowns: 22,
        }
      }
    },
    {
      // user: users[2].id,
      user: { connect: { id: users[2].id } },
      header: "header3",
      stats: {
        create: {}
      }
    },
  ].map(d => prisma.feed.create({ data: d })))
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


async function main() {
  await mock()

  // const user1 = await prisma.user.findOne({
  //   where: { email: "aaa@aaa.com" }
  // })
  // const feed1 = await prisma.feed.findOne({
  //   where: { id: 1 },
  //   include: { stats: true }
  // })
  // // .stats()
  // // const stats = await feed1.stats()

  // const feeds = await prisma.feed.findMany({
  //   after: { id: 1 }
  //   // first: 1,
  //   // orderBy: { createdAt: "desc" }
  //   // orderBy: {}
  //   // select: { id: true, header: true, stats: { select: { id: true } } },
  //   // include: { stats: true }
  // })
  // console.log(feeds)
  // console.log(feeds[0])
}

main()
  .catch(e => { throw e })
  .finally(async () => {
    console.log("DB executed!")
    await prisma.disconnect()
  })