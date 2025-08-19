import "dotenv/config";
import express from "express";
import {login} from "./controller/authController";
import {register} from "./controller/authController";
import { tododb } from "./db";
import dotenv from "dotenv";
import authRouter from "./router/authRouter";
import todoRouter from "./router/todoRouter";


const app = express();

dotenv.config(); 
app.use(express.json());

app.post('/api/login', login)
app.post('/api/register', register);
app.use("/api", authRouter);
app.use("/todo", todoRouter);


tododb.initialize()
  .then(() => {
    console.log("DB connected");
    app.listen(process.env.PORT || 4000, () =>
      console.log(`Server running on http://localhost:${process.env.PORT || 4000}`)
    );
  })
  .catch((err) => console.error("DB Init Failed", err));
