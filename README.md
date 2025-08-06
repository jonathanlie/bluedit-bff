# Bluedit BFF

GraphQL Backend for Frontend (BFF) server that acts as a proxy between the frontend and Rails API.

## Features

- GraphQL API with Apollo Server
- Authentication via Google OAuth2
- Subbluedit and Post management
- Comments and voting system
- Session management via HTTP-only cookies

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Available Scripts

- `npm run dev` - Start development server with hot reload (nodemon)
- `npm start` - Start production server
- `npm test` - Run tests (not configured yet)
- `npm run lint` - Lint code (not configured yet)
- `npm run format` - Format code (not configured yet)

### Development Server

The development server runs on `http://localhost:4000` with:

- Hot reload on file changes
- GraphQL endpoint at `/`
- Health check at `/health`

### Project Structure

```
src/
├── config/          # Configuration management
├── middleware/      # Express middleware
├── schema/          # GraphQL schema definitions
│   ├── types/       # GraphQL types
│   ├── queries/     # GraphQL queries
│   ├── mutations/   # GraphQL mutations
│   └── resolvers/   # GraphQL resolvers
├── services/        # External service integrations
└── utils/           # Utility functions
```

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
  createPost(
    subblueditId: "dota2"
    title: "New Meta"
    body: "What do you think about the new meta?"
  ) {
    id
    title
    body
  }
}
```

### Create Comment

```graphql
mutation {
  createComment(
    postId: "post-uuid"
    body: "Great post! I agree with your analysis."
  ) {
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
