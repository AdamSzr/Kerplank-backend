
import { Endpoints } from "../config"
import { Project } from "../models/Project"
import { UpdateProjectRequest } from "../models/request/UpdateProjectRequest"
import { Task } from "../models/Task"
import { User } from "../models/User"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"

export type UpdateTaskRequest = {
    title?: string;
    description?: string;
    assignedTo?: string;
    dateTimeCreation?: string;
    dateTimeDelivery?: string;
    status?: "NEW" | "IN_PROGRESS" | "DONE"
}



const updateTask = (taskId:string,updateTaskRequest: UpdateTaskRequest) => {

    return ax<Project>(Endpoints['edit.task'].replace(":taskId:",taskId), 'PUT', updateTaskRequest)
}

export default updateTask