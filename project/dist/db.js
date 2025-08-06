"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tododb = exports.db = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../src/entity/user");
const todo_1 = require("../src/entity/todo");
require('dotenv').config();
exports.db = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [user_1.User],
});
exports.tododb = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [todo_1.todolist],
});
//# sourceMappingURL=db.js.map