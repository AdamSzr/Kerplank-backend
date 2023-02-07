

import { Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { SingleFile } from "../models/SingleFile"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


const uploadFile = (request: any) => { // TODO Change to typeof MultiPartData
   return ax(Endpoints["drive.upload"], "POST", request)
}




export type UploadMulitFileResponse = { files: SingleFile[] } & BaseResponse


export const uploadMultipleFile = async (formData: FormData): Promise<UploadMulitFileResponse> => { // TODO Change to typeof MultiPartData
   console.log(formData)


   const response = await fetch('http://192.168.1.22:8080/api/drive/upload/multi', {
      method: 'POST',
      body: formData
   });

   const data = await response.json() as Promise<UploadMulitFileResponse>
   console.log(data);

   return data
}
export default uploadFile