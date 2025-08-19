/* eslint-disable @typescript-eslint/no-unused-vars */
//import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next)=>{
    const token = req.headers.authorization; 
        if (!token) {
          return res.status(401).send('Access Denied!');
        }
        try{
          const VerifyToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
          next();
        }catch(err){
          res.status(400).send('Invalid token!');
        }
}