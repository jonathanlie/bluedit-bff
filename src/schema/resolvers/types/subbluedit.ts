import { SubblueditResolvers, ResolversParentTypes } from '../../../generated/graphql-types.js';

export const subblueditResolvers: SubblueditResolvers = {
  user: async (subbluedit: ResolversParentTypes['Subbluedit']) => subbluedit.user ?? null,
  posts: async (subbluedit: ResolversParentTypes['Subbluedit']) => subbluedit.posts ?? [],
};
