// API response types that match the Rails API structure
export interface ApiUser {
  id: string;
  name?: string;
  email: string;
  avatar_url?: string;
}

export interface ApiPost {
  id: string;
  title: string;
  body: string;
  user?: ApiUser;
  subbluedit?: ApiSubbluedit;
  comments?: ApiComment[];
  votes?: ApiVote[];
}

export interface ApiComment {
  id: string;
  body: string;
  user?: ApiUser;
  post?: ApiPost;
  parent_comment?: ApiComment;
  replies?: ApiComment[];
  votes?: ApiVote[];
}

export interface ApiVote {
  id: string;
  value: number;
  user?: ApiUser;
  votable?: ApiPost | ApiComment;
}

export interface ApiSubbluedit {
  id: string;
  name: string;
  description?: string;
  user?: ApiUser;
  posts?: ApiPost[];
}

export interface ApiAuthResponse {
  token: string;
  user: ApiUser;
}

export interface ApiVoteResponse {
  success: boolean;
}
