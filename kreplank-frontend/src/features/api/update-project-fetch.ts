import { Endpoints } from "../config"
import { UpdateProjectRequest } from "../models/request/UpdateProjectRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"

const updateProject = (projectId:string,updateProjectRequest: UpdateProjectRequest) => {
    const url = Endpoints['edit|delete.project'].replace(":projectId:",projectId)

    return ax(url, 'PUT', updateProjectRequest)
}

export default updateProject