import gql from 'graphql-tag'

export const typeDefs = gql`
  type Query {
    newPosts(after: String): [Post!]!
    risingPosts(after: String): [Post!]!
    trendPosts(after: String): [Post!]!
    post(id: ID!): Post!

    comments(postId: ID!, after: String): [Comment!]!

    symbol(id: ID!, slug: String!): Symbol!
    ticks(symbolId: ID!, after: String): [Tick!]!
    # event(id: ID!): Event!
    # ticker(id: ID, name: String): Ticker!

    tagHints(input: String): [String!]!
    tickerHints(input: String): [String!]!
    eventHints(input: String): [String!]!

    me: User!
    myPosts: [ID!]!
    myPostLikes(after: String): [PostLike!]!
    myPostVotes(after: String): [PostVote!]!
    myComments(after: String): [ID!]!
    myCommentLikes(after: String): [CommentLike!]!
    myFollows: [Follow!]!
    myCommits(after: String): [ID!]!
    myCommitReviews(after: String): [CommitReview!]!
    myWaitedCommitReviews: [CommitReview!]!

    ### upcoming ###
    # myBets: [Bet!]!
    # myNotices: [Notice!]!
    # mySignals: [Signal]
    # groups: [Group]
    # myGroups: [Group]
    # groupPosts(groupId: ID): [Post]
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!

    fetchPage(link: String!): Page!

    createPost(data: PostInput!): Post!
    updatePost(id: ID!, data: PostInput!): Post!
    createPostLike(postId: ID!, data: LikeInput!): PostLike!
    updatePostLike(postId: ID!, data: LikeInput!): PostLike!
    createPostVote(postId: ID!, data: VoteInput!): PostVote!
    updatePostVote(postId: ID!, data: VoteInput!): PostVote!

    createComment(data: CommentInput!): Comment!
    updateComment(id: ID!, data: CommentInput!): Comment!
    createCommentLike(commentId: ID!, data: LikeInput!): CommentLike!
    updateCommentLike(commentId: ID!, data: LikeInput!): CommentLike!

    createCommit(data: CommitInput!): Commit!
    updateCommit(id: ID!, data: CommitInput!): Commit!
    applyCommitReview(commitId: ID!): ApplyCommitReviewResult!
    updateCommitReview(commitId: ID!, data: CommitReviewInput!): CommitReview!

    createFollow(symbolId: ID!, data: FollowInput!): Follow!
    updateFollow(symbolId: ID!, data: FollowInput!): Follow!

    ### upcoming ###
    # uploadImg(): Img
    # createBet(): Bet
    # upsertBet(data: BetInput): Bet
    # createGroup(data: GroupInput): Group
    # updateGroup(data: GroupInput): Group
    # joinGroup(id: ID): Boolean
    # leaveGroup(id: ID): Boolean
    # inviteJoin(groupId: ID, criteria: String): Boolean
  }

  type Page {
    id: ID!
    post: Post # null if not existed
    title: String
    symbols: [String!]
    tags: [String!]
    events: [String!]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type User {
    id: ID!
    email: String!
    # profileImage: String
    # trips: [Launch]!
  }

  type Post {
    id: ID!
    userId: ID
    view: View!
    title: String
    content: String
    symbols: [Symbol!]!
    count: PostCount!
    voteCount: PostVoteCount
    createdAt: DateTime
    updatedAt: DateTime
  }

  input PostInput {
    view: View
    title: String
    content: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type PostLike {
    postId: ID!
    choice: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input LikeInput {
    choice: Int!
  }

  type PostVote {
    postId: Int!
    choice: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input VoteInput {
    choice: Int!
  }

  type PostCount {
    id: ID!
    nViews: Int!
    nUps: Int!
    nDowns: Int!
    nComments: Int!
    updatedAt: DateTime!
  }

  type PostVoteCount {
    id: ID!
    result: String!
    updatedAt: DateTime!
  }

  type Comment {
    id: ID!
    view: View!
    content: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CommentInput {
    view: View
    content: String!
  }

  type CommentCount {
    id: ID!
    nViews: Int!
    nUps: Int!
    nDowns: Int!
    updatedAt: DateTime!
  }

  type CommentLike {
    commentId: ID!
    choice: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Symbol {
    id: ID!
    slug: String!
    valid: Boolean!
    title: String
    content: String
    posts: [Post!]!
    ticks: [Tick!]!
    commits: [ID!]!
  }

  type Follow {
    id: ID!
    symbol: Symbol!
    followed: Boolean!
    # createdAt: DateTime!
    updatedAt: DateTime!
  }

  input FollowInput {
    symbolId: ID!
    followed: Boolean!
  }

  type Commit {
    id: ID!
    symbolId: ID!
    action: CommitAction!
    diff: String
    post: Post
    reviews: [CommitReview]
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CommitInput {
    action: CommitAction!
    postContent: String!
    # post: String!
  }

  type CommitReview {
    id: ID!
    user: User
    commit: Commit
    choice: Int
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CommitReviewInput {
    commit: ID!
    choice: Int!
  }

  type Tick {
    id: ID!
    symbolId: ID!
    value: Float!
    at: DateTime!
  }

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

  enum View {
    PUBLIC
    DELETED
    REPORTED
    LOCKED
  }

  scalar DateTime
`
