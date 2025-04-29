import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      currentUser?: TokenPayload;
    }
  }
}

export interface TokenPayload {
  userId: string;
  email: string;
  activeProject: IActiveProject;
}

export interface IActiveProject {
  projectId: string;
  type: string;
}

export interface IAuth {
  email: string;
  password: string;
}

export interface AppContext {
  req: Request;
  res: Response;
  user?: {
    userId: string;
    email: string;
  };
}

export interface IDataSource {
  id: string;
  projectId: string;
  type: string;
  database: string;
}
