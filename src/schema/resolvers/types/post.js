export const postTypeResolvers = {
  user: async (post) => post.user,
  subbluedit: async (post) => post.subbluedit,
  comments: async (post) => post.comments || [],
  votes: async (post) => post.votes || [],
};
