import gql from 'graphql-tag'
import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from './resolvers'

const typeDefs = gql`

type Query {
  feeds(after: String): [Feed!]!
  feed(id: ID!): Feed
  comments(feedId: ID!, after: String): [Comment!]!
  event(id: ID!): Event
  ticker(id: ID!): Ticker
  tag(id: ID!): Tag

  hotFeeds: [Feed!]!
  
  me: User
  myEvents: [Event!]!
  myTickers: [Ticker!]!
  myFeedVotes: [FeedVote!]!
  myPollVotes: [PollVote!]!
  myNotices: [Notice!]!

  # --- upcoming ---
  # mySignals: [Signal]
  # myBets: [Bet]
  # groups: [Group]
  # myGroups: [Group]
  # groupPosts(groupId: ID): [Post]
}

type Mutation {
  upsertFeed(data: FeedInput): Feed
  deleteFeed(id: ID): Boolean
  upsertFeedVote(feedId: ID): FeedVote
  # createFeedReport(feedId: ID): FeedReport

  upsertEventCommit(data: EventCommitInput): EventCommit
  deleteEventCommit(data: EventCommitInput): EventCommit
  updateEventCommitReview(data: EventCommitReviewInput): EventCommitReview

  upsertTagCommit(data: TagCommitInput): TagCommit
  deleteTagCommit(data: TagCommitInput): TagCommit
  updateTagCommitReview(data: TagCommitReviewInput): TagCommitReview

  upsertPost(data: PostInput): Post
  deletePost(id: ID): Boolean

  upsertPoll(data: PollInput): Poll
  deletePoll(id: ID): Boolean

  upsertComment(data: CommentInput): Comment
  deleteComment(id: ID): Boolean

  # --- upcomings ----
  # upsertBet(data: BetInput): Bet
  # createGroup(data: GroupInput): Group
  # updateGroup(data: GroupInput): Group
  # deleteGroup(id: ID): Boolean
  # joinGroup(id: ID): Boolean
  # leaveGroup(id: ID): Boolean
  # inviteJoin(groupId: ID, criteria: String): Boolean

  # createDraft(authorEmail: String, content: String, title: String!): Post!
  # deleteOnePost(where: PostWhereUniqueInput!): Post
  # publish(id: ID): Post
  # signupUser(data: UserCreateInput!): User!
}

type User {
  id: ID
  email: String
  # profile: Profile
}

type Feed {
  id: ID!
  user: User!
  header: String!
  body: String
  event: Event
  tags: [Tag]
  tickers: [Ticker]
  comments: [Comment]
  stats: FeedStats!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type FeedStats {
  id: ID!
  nViews: Int!
  nVoteUps: Int!
  nVoteDowns: Int!
  updatedAt: DateTime!
}

type FeedVote {
  id: ID!
  feed: Feed!
  choice: Int
  createdAt: DateTime
  updatedAt: DateTime
}

type Event {
  id: ID
  header: String!
  tags: [Tag!]!
  tickers: [Ticker!]!
  parent: Event
  children: [Event!]!
  hot: Seq
  posts: [Post!]!
  polls: [Poll!]!
  similarTo: [Event!]!
}

type Tag {
  id: ID!
  valid: Boolean!
  # posts: [Post]
  # feeds: [Feed]
  # events: [Event]
  createdAt: DateTime!
  updatedAt: DateTime!
}


type Ticker {
  id: ID!
  header: String!
  seq: Seq
  events: [Event]
  feeds: [Feed]
}

type Seq {
  id: ID
  from: DateTime!
  to: DateTime!
  values: String
  # values: [Float]!
  # at: [DateTime!]!
}

input FeedCommitInput {
  type: FeedType!
  url: String!
}

input PostInput {
  header: String!
  body: String!
}

scalar DateTime

enum FeedType {
  WEBPAGE
  POST
}

enum TagType {
  TICKER
  TICKER_GROUP
  KEYWORD
}

# input PostWhereUniqueInput {
#   id: ID
# }

# input UserCreateInput {
#   email: String!
#   id: ID
#   name: String
#   posts: PostCreateManyWithoutPostsInput
# }

# input PostCreateManyWithoutPostsInput {
#   connect: [PostWhereUniqueInput!]
#   create: [PostCreateWithoutAuthorInput!]
# }

# input PostCreateWithoutAuthorInput {
#   content: String
#   id: ID
#   published: Boolean
#   title: String!
# }

# --- upcomings or unsure ---

# type TagStats {
#   id: ID!
#   nCounts: Int
# }


# type Profile {
#   level: Int
#   exp: Int
# }
`

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
})