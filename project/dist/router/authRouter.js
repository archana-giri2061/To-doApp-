"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const authController_1 = require("../controller/authController");
const todoController_1 = require("../controller/todoController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.get("/user", authController_1.getUser);
router.get("/user/:id", authController_1.getUserById);
router.put("/user/:id", authController_1.updateUser);
router.patch("/user/:id", authController_1.patchUser);
router.delete("/user/:id", authController_1.deleteUser);
router.get("/getTodo/", authMiddleware_1.verifyToken, todoController_1.getTodo);
router.post("/addTodo/", authMiddleware_1.verifyToken, todoController_1.addTodo);
router.patch("/updateTodo/:id", authMiddleware_1.verifyToken, todoController_1.updateContent);
router.delete("/deleteTodo/:id", authMiddleware_1.verifyToken, todoController_1.deleteContent);
exports.default = router;
//# sourceMappingURL=authRouter.js.map