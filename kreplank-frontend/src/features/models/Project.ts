import { Task } from "./Task"
import { User } from "./User"


export type Project = {
    id: string,
    title: string,
    description: string,
    dateTimeDelivery: string,
    dateTimeCreation: string,
    status: "ACTIVE" | "CLOSE",
    users: User[]
    files: string[]
    tasks: Task[]
}