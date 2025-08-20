
import type { Request, Response } from "express";
import { tododb } from "../db";
import { todolist } from "../entity/todo";
import { User } from "../entity/user";
import { Comment } from "../entity/comment";
export const getTodo = async (req: Request, res: Response) => {
  try {
    const todoRepo = tododb.getRepository(todolist);

    const todos = await todoRepo
      .createQueryBuilder("todo")
      .leftJoinAndSelect("todo.user", "user")
      .leftJoinAndSelect("todo.likedBy", "likedBy")
      .leftJoinAndSelect("todo.comments", "comments")
      .leftJoinAndSelect("comments.user", "commentUser")
      .select([
        "todo.taskId",          
        "user.userId",
        "user.userName",
        "likedBy.userId",
        "likedBy.userName",
        "comments.commentId",
        "comments.comment",
        "commentUser.userId",
        "commentUser.userName"
      ])
      .getMany();

    // add likes count
    const todosWithLikes = todos.map(todo => ({
      ...todo,
      likes: todo.likedBy ? todo.likedBy.length : 0
    }));

    res.status(200).json(todosWithLikes);

  } catch (error) {
    console.error("Error getting tasks:", error);
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message || error
    });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  const parsedTaskId = parseInt(taskId, 10);
  if (isNaN(parsedTaskId)) {
    return res.status(400).json({ message: "Invalid taskId in URL" });
  }

  try {
    const todoRepo = tododb.getRepository(todolist);

    const todo = await todoRepo.findOne({
      where: { taskId: parsedTaskId },
      relations: ["user", "comments", "comments.user"], 
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error("Error getting task:", error);
    res.status(500).json({ message: "Failed to fetch task", error });
  }
};

export const addComment = async (req: Request, res: Response) => {
  console.log("Request: ", req.params);
  const { comment, userId, taskId } = req.body as { comment: string; userId: number; taskId: number };
  console.log("Request: ", req.body);

  if (!comment || !userId) {
    return res.status(400).json({ message: "Both comment and userId are required" });
  }

  try {
    const todoRepo = tododb.getRepository(todolist);
    const userRepo = tododb.getRepository(User);
    const commentRepo = tododb.getRepository(Comment);

    const todo = await todoRepo.findOneBy({ taskId: taskId });
    if (!todo) {
      return res.status(404).json({ message: "Task not found" });
    }
    const user = await userRepo.findOneBy({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newComment = new Comment();
    newComment.comment = comment;
    newComment.user = user;
    newComment.todo = todo;

    await commentRepo.save(newComment);

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment", error });
  }
};

export const likeTodo = async(req:Request, res:Response)=>{
  const {taskId} = req.params;
  console.log("request:", req.params);
  const userId = req.body.userId;
  console.log(req.body);

  try{
    const todoRepo=tododb.getRepository(todolist);
    const userRepo = tododb.getRepository(User);

    const todo = await todoRepo.findOne({
      where:{taskId: parseInt(taskId,10)},
      relations:["likedBy"],
    });
    if(!todo){
      return res.status(404).json({message:"Todo not found"});
    }
    const user = await userRepo.findOne({where:{userId}});
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    const alreadyLiked = todo.likedBy.some((people)=> people.userId===user.userId);
    if(alreadyLiked){
      return res.status(400).json({message:"You have already liked this task"});
    }
    todo.likedBy.push(user);
    await todoRepo.save(todo);
    res.status(200).json({message: "Task liked succssfully", todo});
  }catch(error){
    console.log("Error liking task:", error);
    res.status(500).json({message:"Failed to like task", error});
  }
}
export const addTodo = async (req: Request, res: Response) => {
  try {
    try{
      const { content, status, userId } = req.body as{content:string, status: string, userId:number };
      console.log("Request: ", req.body);
      if(!userId){
        return res.status(400).json({message: "User Id is required in request body"});
      }

      const todoRepo = tododb.getRepository(todolist);
      const userRepo = tododb.getRepository(User);

      const user = await userRepo.findOneBy({ userId:userId});

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
   
    }catch(error){
      res.status(400).send('Invalid token!');
    }
      
  } catch (error) {
    console.error("Error adding task:", error);
    console.log("Task add failed")
    res.status(500).json({ message: "Task add failed", error });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const { content, status, userId } = req.body as{content:string, status: string, userId:number };
    console.log("Request: ", req.body);
    if(!userId){
      return res.status(400).json({message: "User Id is required in request body"});
    }

    const todoRepo = tododb.getRepository(todolist);

    const taskToUpdate = await todoRepo.findOne({
      where: { taskId, user: { userId:userId } },
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
    const taskId = parseInt(req.params.id, 10);
    const { userId } = req.body as { userId: number };

    if (!userId) {
      return res.status(400).json({ message: "User ID is required in request body" });
    }

    const todoRepo = tododb.getRepository(todolist);

    const taskToDelete = await todoRepo.findOne({
      where: { taskId, user: { userId:userId } },
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
