import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { tododb } from "../db";
import { User } from "../entity/user";

dotenv.config();

//const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";
const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET || "accesssecret";
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || "refreshsecret";

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, userEmail, password } = req.body;
    if (!userName || !userEmail || !password) {
      console.log("All fields are required");
      return res.status(400).json({ message: "All fields are required." });
    }

    const userRepo = tododb.getRepository(User);
    const existingUser = await userRepo.findOneBy({ userEmail });

    if (existingUser) {
      console.log("Email already registered.");
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.userName = userName;
    newUser.userEmail = userEmail;
    newUser.Password = hashedPassword;

    await userRepo.save(newUser);

    res.status(201).json({ message: "User registered successfully" });
    console.log("User registered successfully");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { userEmail, password } = req.body;

    const userRepo = tododb.getRepository(User);
    const user = await userRepo.findOneBy({ userEmail });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.Password) {
      console.log("Password not found in user record");
      return res.status(500).json({ message: "Password not found in user record" });
    }

    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      console.log("Incorrect password");
      return res.status(401).json({ message: "Incorrect password" });
    }

    const accessToken = jwt.sign(
      { userId: user.userId, email: user.userEmail },
      ACCESS_SECRET,
      {expiresIn: "15m"}

    );
    const refreshToken = jwt.sign(
      { userId: user.userId, email: user.userEmail },
      REFRESH_SECRET,
      {expiresIn: "1d"}

    );

    res.json({ message: "Login successful", accessToken, refreshToken });
    console.log("login successfully")
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error });
    console.log("login failed")
  }
};

export const getUser = async (_req: Request, res: Response) => {
  const userRepo = tododb.getRepository(User);
  const users = await userRepo.find();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    console.log("Invalid user Id")
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const userRepo = tododb.getRepository(User);
  const user = await userRepo.findOneBy({ userId: parseInt(req.params.id) });

  if (!user) {
    console.log("User not found")
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const userRepo = tododb.getRepository(User);
  const user = await userRepo.findOneBy({ userId: parseInt(req.params.id) });

  if (!user) return res.status(404).json({ message: "User not found" });

  user.userEmail = req.body.userEmail || user.userEmail;
  user.userName = req.body.userName || user.userName;

  if (req.body.password) {
    user.Password = await bcrypt.hash(req.body.password, 10);
  }

  await userRepo.save(user);
  console.log("User updated")
  res.json({ message: "User updated", user });
};

export const patchUser = async (req: Request, res: Response) => {
  const userRepo = tododb.getRepository(User);
  const user = await userRepo.findOneBy({ userId: parseInt(req.params.id) });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.body.password) {
    req.body.Password = await bcrypt.hash(req.body.password, 10);
    delete req.body.password;
  }

  Object.assign(user, req.body);
  await userRepo.save(user);

  res.json({ message: "User patched", user });
  console.log("User update")
};

export const deleteUser = async (req: Request, res: Response) => {
  const userRepo = tododb.getRepository(User);
  const result = await userRepo.delete({ userId: parseInt(req.params.id) });

  if (result.affected === 0)
    return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted" });
  console.log("User deleted successfully")
};


