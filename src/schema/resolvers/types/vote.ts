import { VoteResolvers, ResolversParentTypes } from '../../../generated/graphql-types.js';

export const voteResolvers: VoteResolvers = {
  user: async (vote: ResolversParentTypes['Vote']) => vote.user ?? null,
  votable: async (vote: ResolversParentTypes['Vote']) => vote.votable ?? null,
};
