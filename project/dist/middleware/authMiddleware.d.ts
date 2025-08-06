import { Request, Response, NextFunction } from "express";
export interface AuthenticatedRequest extends Request {
    user?: any;
}
export declare const verifyToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
