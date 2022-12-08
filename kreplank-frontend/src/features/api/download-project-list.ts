import { Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { Project } from "../models/Project"
import { CreateProjectRequestBody } from "../models/request/CreateProjectRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"



export type ProjectListResponse = Project & BaseResponse

const getProjectsList = () => {


    return ax<ProjectListResponse>(Endpoints["project"], 'GET')
}

export default getProjectsList