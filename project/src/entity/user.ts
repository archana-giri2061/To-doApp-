import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { todolist } from "./todo";

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
}
