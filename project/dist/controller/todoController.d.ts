import type { Request, Response } from "express";
export declare const getTodo: (req: Request, res: Response) => Promise<void>;
export declare const addTodo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateContent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteContent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
