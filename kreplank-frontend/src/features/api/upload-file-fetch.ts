

import { backendUrlStorage, Endpoints, jwtTokenStorage } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { DirectoryItem } from "../models/DirectoryItem"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"
import { Project } from "../models/Project"


export type UploadMulitFileResponse = { project: Project } & BaseResponse


export const uploadMultipleFile = async (formData: FormData, directory?: string): Promise<UploadMulitFileResponse> => { // TODO Change to typeof MultiPartData
   console.log(formData)
   const backendUrl = backendUrlStorage.getOrThrow()
   const jwt = jwtTokenStorage.tryGet()

   let url = `${backendUrl}/api/drive/upload/multi`
   if (directory) {
      url += `?directory=${directory}`
   }

   console.log(`Upload files to ${url}`)

   const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers:{
         "Authorization":`${jwt}`
      },
   });

   const data = await response.json() as Promise<UploadMulitFileResponse>
   console.log(data);

   return data
}

export default uploadMultipleFile