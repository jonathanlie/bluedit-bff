import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from '../middleware/context.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Comment = {
  __typename?: 'Comment';
  body: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  parentComment?: Maybe<Comment>;
  post?: Maybe<Post>;
  replies?: Maybe<Array<Comment>>;
  user?: Maybe<User>;
  votes?: Maybe<Array<Vote>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment?: Maybe<Comment>;
  createPost?: Maybe<Post>;
  createSubbluedit?: Maybe<Subbluedit>;
  signInWithGoogle?: Maybe<User>;
  vote?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationCreateCommentArgs = {
  body: Scalars['String']['input'];
  postId: Scalars['ID']['input'];
};


export type MutationCreatePostArgs = {
  body?: InputMaybe<Scalars['String']['input']>;
  subblueditName: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateSubblueditArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationSignInWithGoogleArgs = {
  googleToken: Scalars['String']['input'];
};


export type MutationVoteArgs = {
  value: Scalars['Int']['input'];
  votableId: Scalars['ID']['input'];
  votableType: Scalars['String']['input'];
};

export type Post = {
  __typename?: 'Post';
  body: Scalars['String']['output'];
  comments?: Maybe<Array<Comment>>;
  id: Scalars['ID']['output'];
  subbluedit?: Maybe<Subbluedit>;
  title: Scalars['String']['output'];
  user?: Maybe<User>;
  votes?: Maybe<Array<Vote>>;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  postById?: Maybe<Post>;
  subblueditByName?: Maybe<Subbluedit>;
};


export type QueryPostByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySubblueditByNameArgs = {
  name: Scalars['String']['input'];
};

export type Subbluedit = {
  __typename?: 'Subbluedit';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  posts?: Maybe<Array<Post>>;
  user?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type Vote = {
  __typename?: 'Vote';
  id: Scalars['ID']['output'];
  user?: Maybe<User>;
  value: Scalars['Int']['output'];
  votable?: Maybe<Voteable>;
};

export type Voteable = Comment | Post;



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  Voteable: ( Comment ) | ( Post );
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Comment: ResolverTypeWrapper<Comment>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subbluedit: ResolverTypeWrapper<Subbluedit>;
  User: ResolverTypeWrapper<User>;
  Vote: ResolverTypeWrapper<Vote>;
  Voteable: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Voteable']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Comment: Comment;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Post: Post;
  Query: {};
  String: Scalars['String']['output'];
  Subbluedit: Subbluedit;
  User: User;
  Vote: Vote;
  Voteable: ResolversUnionTypes<ResolversParentTypes>['Voteable'];
};

export type CommentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parentComment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  replies?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  votes?: Resolver<Maybe<Array<ResolversTypes['Vote']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createComment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<MutationCreateCommentArgs, 'body' | 'postId'>>;
  createPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'subblueditName' | 'title'>>;
  createSubbluedit?: Resolver<Maybe<ResolversTypes['Subbluedit']>, ParentType, ContextType, RequireFields<MutationCreateSubblueditArgs, 'name'>>;
  signInWithGoogle?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSignInWithGoogleArgs, 'googleToken'>>;
  vote?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationVoteArgs, 'value' | 'votableId' | 'votableType'>>;
};

export type PostResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  subbluedit?: Resolver<Maybe<ResolversTypes['Subbluedit']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  votes?: Resolver<Maybe<Array<ResolversTypes['Vote']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  postById?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryPostByIdArgs, 'id'>>;
  subblueditByName?: Resolver<Maybe<ResolversTypes['Subbluedit']>, ParentType, ContextType, RequireFields<QuerySubblueditByNameArgs, 'name'>>;
};

export type SubblueditResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Subbluedit'] = ResolversParentTypes['Subbluedit']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VoteResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Vote'] = ResolversParentTypes['Vote']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  votable?: Resolver<Maybe<ResolversTypes['Voteable']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VoteableResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Voteable'] = ResolversParentTypes['Voteable']> = {
  __resolveType: TypeResolveFn<'Comment' | 'Post', ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  Comment?: CommentResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subbluedit?: SubblueditResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vote?: VoteResolvers<ContextType>;
  Voteable?: VoteableResolvers<ContextType>;
};

