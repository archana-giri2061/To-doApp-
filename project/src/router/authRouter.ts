import * as express from "express";
import { register, login, getUser, updateUser, patchUser, deleteUser, getUserById } from "../controller/authController";
import { verifyToken } from "../middleware/authMIddleware";

//import { verifyToken } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", getUser);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.patch("/user/:id", patchUser);
router.delete("/user/:id",verifyToken, deleteUser);

export default router;


