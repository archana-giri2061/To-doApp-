import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { tododb } from "../db";
import { User } from "../entity/user";

interface DecodedToken extends JwtPayload {
  userId: number;
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({ message: "Access Denied! No token provided." });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as DecodedToken;

    if (!decoded.userId) {
      res.status(400).json({ message: "Invalid token payload." });
      return;
    }

    const userRepo = tododb.getRepository(User);
    const user = await userRepo.findOne({ where: { userId: decoded.userId, deletedAt: null } });

    if (!user) {
      res.status(404).json({ message: "User not found or deleted." });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token!", error });
  }
};
