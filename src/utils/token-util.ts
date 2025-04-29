import { envConfig } from "../config/env.config";
import { TokenPayload } from "../interfaces/auth.interface";
import { sign, verify } from "jsonwebtoken";
import { Request } from 'express';
import { GraphQLError } from "graphql";

export const generateAccessToken = (payload: TokenPayload): string => {
  return sign(payload, envConfig.JWT_ACCESS_SECRET);
};

export const verifyToken = (token: string, secret: string): TokenPayload => {
  return verify(token, secret) as TokenPayload;
}

export const authenticateGraphQLRoute = (req: Request): void => {
  if (!req.session?.userId) {
    throw new GraphQLError('Please login again.');
  }

  // Set the current user from session details
  req.currentUser = {
    userId: req.session.userId,
    email: req.session.email,
    activeProject: req.session.activeProject || null,
  };
};
