import * as express from "express";
import { getTodo, addTodo, updateContent, deleteContent, addComment, getTodoById, likeTodo} from "../controller/todoController";
import { verifyToken } from "../middleware/authMIddleware";

export const router = express.Router();

router.get("/getTodo",verifyToken, getTodo);
router.get("/getTodoById/:taskId",verifyToken , getTodoById);
router.post("/addComment", verifyToken, addComment)
router.post("/addTodo",verifyToken, addTodo);
router.post("/like/:taskId",verifyToken, likeTodo);
router.patch("/updateTodo/:id",verifyToken, updateContent)
router.delete("/deleteTodo/:id",verifyToken, deleteContent)
export default router;