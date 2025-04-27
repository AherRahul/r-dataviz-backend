import { buildSchema } from "graphql";

export const authSchema = buildSchema(`#graphql
  input Auth {
    email: String!
    password: String!
  }

  type User {
    id: String
    email: String
  }

  type DataSource {
    database: String!
    id: String!
    projectId: String!
    type: String!
  }

  type UserResponse {
    user: User!
    projectIds: [DataSource!]
    collections: [String!]
  }

  type LogoutResponse {
    message: String
  }

  type Query {
    checkCurrentUser: UserResponse
  }

  type Mutation {
    loginUser(email: String!, password: String!): UserResponse!
    registerUser(user: Auth!): UserResponse!
    logout: LogoutResponse
  }
`);
