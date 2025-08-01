export const voteTypeResolvers = {
  user: async (vote) => vote.user,
  votable: async (vote) => vote.votable,
};
