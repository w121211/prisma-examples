import { objectType } from 'nexus'

export const FeedVote = objectType({
  name: 'FeedVote',
  definition(t) {
    t.model.id()
    t.model.choice()
  },
})
