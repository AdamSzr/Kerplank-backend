import { Task } from "./Task"
import { User } from "./User"


export type Project = {
    id: string,
    title: string,
    description: string,
    dateTimeDelivery: string,
    dateTimeCreation: string,
    status: "ACTIVE" | "CLOSE",
    users: string[]
    files: string[]
    tasks: Task[]
    creator:string
}