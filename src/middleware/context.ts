import { Request, Response } from 'express';

interface ContextParams {
  req: Request;
  res: Response;
}

export interface GraphQLContext {
  req: Request;
  res: Response;
}

export const contextMiddleware = async ({ req, res }: ContextParams): Promise<GraphQLContext> => {
  return { req, res };
};
