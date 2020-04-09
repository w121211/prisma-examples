import gql from 'graphql-tag'
import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from './resolvers'

const typeDefs = gql`

type Query {
  feeds(after: String): [Feed!]!
  feed(id: ID!): Feed!
  event(id: ID!): Event!
  ticker(id: ID, name: String): Ticker!
  
  comments(feedId: ID!, after: String): [Comment!]!
  seq(id: ID!): Seq
  # tag(id: ID, name: String): Tag

  trendFeeds: [Feed!]!
  
  me: User
  myLikes: [Like]
  myEventFollows: [EventFollow]
  myTickerFollows: [TickerFollow]
  myCommitReviews: [CommitReview]
  # myPollVotes: [PollVote!]!

  # --- upcoming ---
  # myNotices: [Notice!]!
  # mySignals: [Signal]
  # myBets: [Bet]
  # groups: [Group]
  # myGroups: [Group]
  # groupPosts(groupId: ID): [Post]

  launches(pageSize: Int, after: String): LaunchConnection!
  launch(id: ID!): Launch
}

type Mutation {
  createComment(data: CommentInput!): Comment!
  updateComment(id: ID!, data: CommentInput!): Comment!

  createLike(data: LikeInput!): Like!
  updateLike(id: ID!, data: LikeInput!): Like!

  signup(email: String!, password: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!

  urlToFeed(url: String): Feed!
  upsertFeed(id: ID, data: FeedInput): Feed!

  # createFeedReport(feedId: ID): FeedReport
  
  
  upsertCommit(data: CommitInput): Commit
  updateCommitReview(data: CommitReviewInput): CommitReview

  # upsertPost(data: PostInput): Post
  # upsertPoll(data: PollInput): Poll

  # 因為follow需要先檢查資格，不能用upsert
  followEvent(eventId: ID): EventFollow!
  unfollowEvent(eventId: ID): EventFollow!

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

  # if false, signup failed -- check errors
  bookTrips(launchIds: [ID]!): TripUpdateResponse!
  # if false, cancellation failed -- check errors
  cancelTrip(launchId: ID!): TripUpdateResponse!
  # login(email: String): String # login token
  # for use with the iOS tutorial
  # uploadProfileImage(file: Upload!): User
}

type AuthPayload {
  token: String!
  user: User!
}

# type User {
#   id: ID
#   email: String
#   # profile: Profile
# }

type Feed {
  id: ID!
  user: User
  header: String!
  body: String
  event: Event
  tags: [Tag!]!
  tickers: [Ticker!]!
  # comments: [Comment]
  stats: FeedStats!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type FeedStats {
  id: ID!
  nViews:Int!
  nVoteUps:Int!
  nVoteDowns:Int!
  nComments:Int!
}

type Comment {
  id: ID!
  # user: ID!
  body: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CommentInput {
  body: String!
}

type Like {
  id: ID!
  feedId: ID
  postId: ID
  pollId: ID
  commentId: ID  
  choice: Int
  createdAt: DateTime
  updatedAt: DateTime
}

input LikeInput {
  feedId: ID
  postId: ID
  pollId: ID
  commentId: ID
  choice: Int!
}

type Event {
  id: ID
  slug: String!
  header: String!
  tags: [Tag!]!
  tickers: [Ticker!]!
  parent: Event
  children: [Event!]!
  hot: Seq
  posts: [Post!]!
  # polls: [Poll!]!
  similarTo: [Event!]!
}

type EventFollow{
  id: ID!
  user: User
  # event: Event
  event: ID
  isFollowed: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type TickerFollow{
  id: ID!
  user: User
  # ticker: Ticker
  ticker: ID
  isFollowed: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Tag {
  id: ID!
  name: String!
  valid: Boolean!
  # posts: [Post]
  # feeds: [Feed]
  # events: [Event]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type TagDetail {
  id: ID!
  valid: Boolean!
}

type Ticker {
  id: ID!
  name: String!
  seq: Seq
  events: [Event]
  feeds: [Feed]
}



type Post {
  id: ID!
  user: User
  body: String
  createdAt: DateTime
  updatedAt: DateTime
}

type Poll {
  id: ID!
  user: User
  body: String
  createdAt: DateTime
  updatedAt: DateTime
}

type Commit {
  id: ID
  user: User
  event: Event
  ticker: Ticker
  tag: Tag
  action: CommitAction
  description: String
  diff: String
  comments: [Comment]
  commitReviews: [CommitReview]
  createdAt: DateTime
  updatedAt: DateTime
}

type CommitReview {
  id: ID
  user: User
  commit: Commit
  choice: Int
  createdAt: DateTime
  updatedAt: DateTime
}

type Seq {
  id: ID
  from: DateTime!
  to: DateTime!
  values: String
  # values: [Float]!
  # at: [DateTime!]!
}

input FeedInput {
  header: String
  url: String
  post: ID
  tags: [ID]
}

input PostInput {
  header: String!
  body: String!
}




input CommitInput {
  objType: String
  objId: ID
  action: CommitAction
  description: String
  diff: String
}

input CommitReviewInput {
  id: ID
  commit: ID
  choice: Int
}

scalar DateTime

enum TrackState {
  TRACKING
  UNTRACKING
}

enum FeedType {
  WEBPAGE
  POST
}

enum TagType {
  TICKER
  TICKER_GROUP
  KEYWORD
}

enum Likable {
  FEED
  POST
  POLL
  COMMENT
}

enum Taggable {
  FEED
  EVENT
  POST
}

enum CommitAction {
  CREATE
  UPDATE
  DELETE
  MERGE
}

type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
}

"""
Simple wrapper around our list of launches that contains a cursor to the
last item in the list. Pass this cursor to the launches query to fetch results
after these.
"""
type LaunchConnection {
  cursor: String!
  hasMore: Boolean!
  launches: [Launch]!
}
type Launch {
  id: ID!
  site: String
  mission: Mission
  rocket: Rocket
  isBooked: Boolean!
}
type Rocket {
  id: ID!
  name: String
  type: String
}
type User {
  id: ID!
  email: String!
  profileImage: String
  trips: [Launch]!
}
type Mission {
  name: String
  missionPatch(size: PatchSize): String
}
enum PatchSize {
  SMALL
  LARGE
}

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