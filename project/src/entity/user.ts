import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany,DeleteDateColumn } from "typeorm";
import { todolist } from "./todo";
import{Comment} from "./comment";

@Entity()
export class User {
  //[x: string]: any;
  @PrimaryGeneratedColumn("increment") 
  userId: number;
  @Column({unique: true})
  userEmail: string;
  @Column()
  Password: string;
  @Column()
  userName: string;
  @OneToMany(() => todolist, (todo) => todo.user)
  todos: todolist[];
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
  @ManyToMany(()=>todolist,(todo)=>todo.likedBy)
  likedTodos:todolist[];
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
