import { Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { Project } from "../models/Project"
import { UpdateProjectRequest } from "../models/request/UpdateProjectRequest"
import { ax } from "./ax"

const updateProject = (projectId: string, updateProjectRequest: UpdateProjectRequest) => {
    const url = Endpoints['edit|delete.project'].replace(":projectId:", projectId)

    return ax<{ project: Project } & BaseResponse>(url, 'PUT', updateProjectRequest)
}

export default updateProject