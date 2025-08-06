import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class todolist{
//   static initialize() {
//       throw new Error("Method not implemented.");
//   }
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  content: string;
  @Column()
  status: string;
  @ManyToOne(() => User, (user) => user.todos, { onDelete: "CASCADE" })
  user: User;
}
