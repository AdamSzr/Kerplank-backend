
import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { ax } from "./ax"




export type DeleteFromProjectQuery = { filePath?: string, taskId?: string, userEmail?: string }


const projectDelete = (projectId: string, query?: DeleteFromProjectQuery) => {

    if (query && Object.entries(query).length != 1) {
        throw Error("Cannot modify multiple more than 1 field in project at time")
    }

    const url = Endpoints["edit|delete.project"].replace(':projectId:', projectId)
    return ax(url, 'DELETE', undefined, query)
}

export default projectDelete