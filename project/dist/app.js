"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const authController_1 = require("./controller/authController");
const authController_2 = require("./controller/authController");
require("reflect-metadata");
const db_1 = require("./db");
const authRouter_1 = __importDefault(require("./router/authRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/login', authController_1.login);
app.post('/api/register', authController_2.register);
app.use("/api", authRouter_1.default);
app.use("/todo", authRouter_1.default);
db_1.db.initialize()
    .then(() => {
    console.log("Database connected");
})
    .catch((err) => {
    console.error("DB Init Failed", err);
});
db_1.tododb.initialize()
    .then(() => {
    console.log("Database connected");
})
    .catch((err) => {
    console.error("DB Init Failed", err);
});
app.listen(4000, () => console.log("Server running on http://localhost:4000"));
//# sourceMappingURL=app.js.map