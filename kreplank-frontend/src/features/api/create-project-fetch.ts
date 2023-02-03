import { Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { Project } from "../models/Project"
import { CreateProjectRequestBody } from "../models/request/CreateProjectRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


const createProject = (createProjectRequest: CreateProjectRequestBody) => {
//     project: {id: '63d2e0775c94a336fee745a5', title: 'test-add-to-ui', description: 'brak', dateTimeCreation: '2023-01-26T20:20:07.415395132Z', dateTimeDelivery: '2023-01-26T20:18:48.967Z', …}
// result: "ok"

    return ax<{project:Project} & BaseResponse>(Endpoints['create.project'], 'POST', createProjectRequest)  
}

export default createProject