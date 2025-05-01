import { envConfig } from "@/config/env.config";
import { TokenPayload } from "@/interfaces/auth.interface";
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
  console.log("req.session: ", req.session);
  console.log("req.session?.access: ", req.session?.access);

  if (!req.session?.access) {
    throw new GraphQLError('Please login again.');
  }

  try {
    const payload: TokenPayload = verifyToken(req.session?.access, envConfig.JWT_ACCESS_SECRET);
    req.currentUser = payload;
  } catch (error: any) {
    throw new GraphQLError(error?.message);
  }
}
