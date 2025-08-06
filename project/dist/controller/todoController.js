"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.updateContent = exports.addTodo = exports.getTodo = void 0;
const db_1 = require("../db");
const todo_1 = require("../entity/todo");
const user_1 = require("../entity/user");
const getTodo = async (req, res) => {
    try {
        const { userId } = req.user;
        const todoRepo = db_1.tododb.getRepository(todo_1.todolist);
        const todos = await todoRepo.find({
            where: { user: { id: userId } },
            relations: ["user"],
        });
        res.json(todos);
    }
    catch (error) {
        console.error("Error getting tasks:", error);
        res.status(500).json({ message: "Failed to fetch tasks", error });
    }
};
exports.getTodo = getTodo;
const addTodo = async (req, res) => {
    try {
        const { content, status } = req.body;
        const { userId } = req.user;
        const todoRepo = db_1.tododb.getRepository(todo_1.todolist);
        const userRepo = db_1.tododb.getRepository(user_1.User);
        const user = await userRepo.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const existingContent = await todoRepo.findOne({
            where: { content, user: { id: userId } },
            relations: ["user"],
        });
        if (existingContent) {
            return res.status(400).json({ message: "This task already exists" });
        }
        const newTask = new todo_1.todolist();
        newTask.content = content;
        newTask.status = status;
        newTask.user = user;
        await todoRepo.save(newTask);
        res.status(201).json({ message: "New task added successfully", task: newTask });
    }
    catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Task add failed", error });
    }
};
exports.addTodo = addTodo;
const updateContent = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { content, status } = req.body;
        const { userId } = req.user;
        const todoRepo = db_1.tododb.getRepository(todo_1.todolist);
        const taskToUpdate = await todoRepo.findOne({
            where: { id, user: { id: userId } },
            relations: ["user"],
        });
        if (!taskToUpdate) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }
        taskToUpdate.content = content;
        taskToUpdate.status = status;
        await todoRepo.save(taskToUpdate);
        res.status(200).json({ message: "Task updated successfully", task: taskToUpdate });
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Update failed", error });
    }
};
exports.updateContent = updateContent;
const deleteContent = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { userId } = req.user;
        const todoRepo = db_1.tododb.getRepository(todo_1.todolist);
        const taskToDelete = await todoRepo.findOne({
            where: { id, user: { id: userId } },
            relations: ["user"],
        });
        if (!taskToDelete) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }
        await todoRepo.remove(taskToDelete);
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Deletion failed", error });
    }
};
exports.deleteContent = deleteContent;
//# sourceMappingURL=todoController.js.map