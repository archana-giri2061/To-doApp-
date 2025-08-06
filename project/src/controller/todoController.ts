import type { Request, Response } from "express";
import { tododb } from "../db";
import { todolist } from "../entity/todo";
import { User } from "../entity/user";
import jwt from "jsonwebtoken";

export const getTodo = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send('Access Denied!');
    }
    try{
      const VerifyToken = jwt.verify(token, process.env.JWT_SECRET);
    }catch(err){
      res.status(400).send('Invalid token!');
    }
    const todoRepo = tododb.getRepository(todolist);
    const todos = await todoRepo.find();
    res.json(todos);
  } catch (error) {
    console.error("Error getting tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
};

export const addTodo = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send('Access Denied!');
    }
    try{
      const VerifyToken = jwt.verify(token, process.env.JWT_SECRET);
    }catch(err){
      res.status(400).send('Invalid token!');
    }
      const { content, status, userId } = req.body as{content:string, status: string, userId:number };
      console.log("Request: ", req.body);
      if(!userId){
        return res.status(400).json({message: "User Id is required in request body"});
      }

      const todoRepo = tododb.getRepository(todolist);
      const userRepo = tododb.getRepository(User);

      const user = await userRepo.findOneBy({ userId});

      if (!user) {
        console.log("User not found")
        return res.status(404).json({ message: "User not found" });
      }

      const existingContent = await todoRepo.findOne({
        where: { content, user: { userId} },
        relations: ["user"],
      });

      if (existingContent) {
        console.log("This task already exists");
        return res.status(400).json({ message: "This task already exists" });
      }

      const newTask = new todolist();
      newTask.content = content;
      newTask.status = status;
      newTask.user = user;

      await todoRepo.save(newTask);
      console.log("New task added successfully")
      res.status(201).json({ message: "New task added successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    console.log("Task add failed")
    res.status(500).json({ message: "Task add failed", error });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
     const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send('Access Denied!');
    }
    try{
      const VerifyToken = jwt.verify(token, process.env.JWT_SECRET);
    }catch(err){
      res.status(400).send('Invalid token!');
    }
    const id = parseInt(req.params.id, 10);
    const { content, status, userId } = req.body as{content:string, status: string, userId:number };
    console.log("Request: ", req.body);
    if(!userId){
      return res.status(400).json({message: "User Id is required in request body"});
    }

    const todoRepo = tododb.getRepository(todolist);

    const taskToUpdate = await todoRepo.findOne({
      where: { id, user: { userId:userId } },
      relations: ["user"],
    });

    if (!taskToUpdate) {
      console.log("Task not found or unauthorized!!")
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    taskToUpdate.content = content;
    taskToUpdate.status = status;
    await todoRepo.save(taskToUpdate);

    res.status(200).json({ message: "Task updated successfully", task: taskToUpdate });
    console.log("Task updated successfully")
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Update failed", error });
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
     const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send('Access Denied!');
    }
    try{
      const VerifyToken = jwt.verify(token, process.env.JWT_SECRET);
    }catch(err){
      res.status(400).send('Invalid token!');
    }
    const id = parseInt(req.params.id, 10);
    const { userId } = req.body as { userId: number };

    if (!userId) {
      return res.status(400).json({ message: "User ID is required in request body" });
    }

    const todoRepo = tododb.getRepository(todolist);

    const taskToDelete = await todoRepo.findOne({
      where: { id, user: { userId } },
      relations: ["user"],
    });

    if (!taskToDelete) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    await todoRepo.remove(taskToDelete);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Deletion failed", error });
  }
};

// function next() {
//   throw new Error("Function not implemented.");
// }
