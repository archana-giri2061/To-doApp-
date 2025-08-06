"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.patchUser = exports.updateUser = exports.getUserById = exports.getUser = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const user_1 = require("../entity/user");
const register = async (req, res) => {
    try {
        const { email, password, userName } = req.body;
        console.log("Received registration request");
        console.log("Request body:", req.body);
        const userRepo = db_1.db.getRepository(user_1.User);
        const existingUser = await userRepo.findOneBy({ userEmail: email });
        if (!existingUser) {
            console.log("User already exists with email:", email);
            return res.status(400).json({ message: "User already exists" });
        }
        console.log("No existing user found. Proceeding with registration.");
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        console.log("Password hashed successfully");
        const newUser = userRepo.create({
            userEmail: email,
            Password: hashedPassword,
            userName,
        });
        await userRepo.save(newUser);
        console.log("New user saved to database:", newUser);
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.log("Error occurred during registration:", error);
        res.status(500).json({ message: "Registration failed", error });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Received login request");
        console.log("Request body:", req.body);
        const userRepo = db_1.db.getRepository(user_1.User);
        const user = await userRepo.findOneBy({ userEmail: email });
        if (!user) {
            console.log("No user found with email:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log("User found. Verifying password.");
        const isMatch = await bcryptjs_1.default.compare(password, user.Password);
        if (isMatch) {
            console.log("Password does not match for user:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log("Password verified. Generating token.");
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "your_jwt_secret", { expiresIn: "1h" });
        console.log("Login successful. Token generated.");
        res.json({ message: "Login successful", token });
    }
    catch (error) {
        console.log("Error occurred during login:", error);
        res.status(500).json({ message: "Login failed", error });
    }
};
exports.login = login;
const getUser = async (_req, res) => {
    const userRepo = db_1.db.getRepository(user_1.User);
    const user = await userRepo.find();
    res.json(user);
};
exports.getUser = getUser;
const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    const userRepo = db_1.db.getRepository(user_1.User);
    const user = await userRepo.findOneBy({ userId: id });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const userRepo = db_1.db.getRepository(user_1.User);
    const user = await userRepo.findOneBy({ userId: parseInt(req.params.id) });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    user.userEmail = req.body.userEmail;
    user.userName = req.body.userName;
    user.Password = req.body.Password;
    await userRepo.save(user);
    res.json({ message: "User updated", user });
};
exports.updateUser = updateUser;
const patchUser = async (req, res) => {
    const userRepo = db_1.db.getRepository(user_1.User);
    const user = await userRepo.findOneBy({ userId: parseInt(req.params.id) });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    Object.assign(user, req.body);
    await userRepo.save(user);
    res.json({ message: "User patched", user });
};
exports.patchUser = patchUser;
const deleteUser = async (req, res) => {
    const userRepo = db_1.db.getRepository(user_1.User);
    const result = await userRepo.delete({ userId: parseInt(req.params.id) });
    if (result.affected === 0)
        return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=authController.js.map