import * as express from "express";
import { register, login, getUser, updateUser, patchUser, deleteUser, getUserById } from "../controller/authController";
import { getTodo, addTodo, updateContent, deleteContent} from "../controller/todoController";
//import { verifyToken } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", getUser);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.patch("/user/:id", patchUser);
router.delete("/user/:id", deleteUser);
router.get("/getTodo/", getTodo);
router.post("/addTodo/", addTodo);
router.patch("/updateTodo/:id", updateContent)
router.delete("/deleteTodo/:id", deleteContent)
export default router;


