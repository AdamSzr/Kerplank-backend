import { Endpoints } from "../config"
import { UpdateProjectRequest } from "../models/request/UpdateProjectRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"

const updateProject = (updateProjectRequest: UpdateProjectRequest) => {

    return ax(Endpoints['edit|delete.project'], 'POST', updateProjectRequest)
}

export default updateProject