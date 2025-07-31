# Bluedit BFF

GraphQL Backend for Frontend (BFF) server that acts as a proxy between the frontend and Rails API.

## Features

- GraphQL API with Apollo Server
- Authentication via Google OAuth2
- Subbluedit and Post management
- Comments and voting system
- Session management via HTTP-only cookies

## GraphQL Schema

### Types

- `User`: User information
- `Subbluedit`: Community/forum sections
- `Post`: Posts within subbluedits
- `Comment`: Comments on posts (supports nesting)
- `Vote`: Voting on posts and comments
- `Voteable`: Union type for Post or Comment

### Queries

- `me`: Get current authenticated user
- `subblueditByName(name: String!)`: Get subbluedit by name

### Mutations

- `signInWithGoogle(googleToken: String!)`: Authenticate with Google
- `createSubbluedit(name: String!, description: String)`: Create new subbluedit
- `createPost(subblueditId: ID!, title: String!, body: String)`: Create new post
- `createComment(postId: ID!, body: String!)`: Create comment on post
- `vote(votableId: ID!, votableType: String!, value: Int!)`: Vote on post or comment

## Example Usage

### Authentication
```graphql
mutation {
  signInWithGoogle(googleToken: "google_oauth_token") {
    id
    name
    email
    avatarUrl
  }
}
```

### Create Subbluedit
```graphql
mutation {
  createSubbluedit(name: "dota2", description: "Dota 2 community") {
    id
    name
    description
  }
}
```

### Create Post
```graphql
mutation {
  createPost(subblueditId: "dota2", title: "New Meta", body: "What do you think about the new meta?") {
    id
    title
    body
  }
}
```

### Create Comment
```graphql
mutation {
  createComment(postId: "post-uuid", body: "Great post! I agree with your analysis.") {
    id
    body
    user {
      name
    }
  }
}
```

### Vote on Post
```graphql
mutation {
  vote(votableId: "post-uuid", votableType: "Post", value: 1)
}
```

### Vote on Comment
```graphql
mutation {
  vote(votableId: "comment-uuid", votableType: "Comment", value: -1)
}
```

### Get Subbluedit with Posts and Comments
```graphql
query {
  subblueditByName(name: "dota2") {
    name
    description
    posts {
      id
      title
      body
      comments {
        id
        body
        user {
          name
        }
        replies {
          id
          body
        }
      }
    }
  }
}
```

## Vote Values

- `1`: Upvote
- `-1`: Downvote

## Votable Types

- `"Post"`: Vote on a post
- `"Comment"`: Vote on a comment

## Error Handling

All mutations return appropriate error messages for:
- Authentication failures
- Invalid parameters
- Resource not found
- Validation errors
