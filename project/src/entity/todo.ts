import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user";
import{Comment} from "./comment";
@Entity()
export class todolist{
  @PrimaryGeneratedColumn("increment")
  taskId: number;
  @Column()
  content: string;
  @Column()
  status: string;
  @Column({default:0})
  likes:number;
  @ManyToOne(() => User, (user) => user.todos, { onDelete: "CASCADE" })
  user: User;
  @OneToMany(() => Comment, (comment) => comment.todo)
  comments: Comment[];
  @ManyToMany(()=>User,(user)=>user.likedTodos)
  @JoinTable()
  likedBy:User[];
}
