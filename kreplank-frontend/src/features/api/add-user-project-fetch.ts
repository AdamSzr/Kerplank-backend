
import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { ax } from "./ax"


const deleteProjectRequest = (projectId: string) => {
    const url = Endpoints["edit|delete.project"].replace(':projectId:', projectId)
    return ax(url, 'DELETE')
}

export default deleteProjectRequest