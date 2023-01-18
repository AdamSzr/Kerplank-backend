import { Endpoints } from "../config"
import { BaseResponse, ListResponse } from "../models/BaseResponse"
import { Project } from "../models/Project"
import { CreateProjectRequestBody } from "../models/request/CreateProjectRequest"
import { ax } from "./ax"



export type ProjectListResponse = ListResponse<Project> & BaseResponse

const getProjectsList = () => {
    return ax<ProjectListResponse>(Endpoints['my.project'], 'GET')
}

export default getProjectsList