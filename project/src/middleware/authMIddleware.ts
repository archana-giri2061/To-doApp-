//import { Request, Response, NextFunction } from "express";

const jwt = require("jsonwebtoken");
export const verifyToken = (req, res, next)=>{
    const token = req.headers.authorization;
        if (!token) {
          return res.status(401).send('Access Denied!');
        }
        try{
          const VerifyToken = jwt.verify(token, process.env.JWT_SECRET);
          next();
        }catch(err){
          res.status(400).send('Invalid token!');
        }
}