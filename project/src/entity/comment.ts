import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn} from "typeorm";
import { User } from "./user";
import { todolist } from "./todo";

@Entity()
export class Comment{
  @PrimaryGeneratedColumn("increment")
  commentId: number;
  @Column()
  comment: string;
  @ManyToOne(() => User, (user) => user.comments, { eager:true, onDelete: "CASCADE" })
  user: User;
  @ManyToOne(() => todolist, (todo) => todo.comments, { onDelete: "CASCADE" })
  todo: todolist;
  @CreateDateColumn()
  createdDate:Date;
}
