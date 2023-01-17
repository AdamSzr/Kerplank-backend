import { Endpoints } from "../config"
import { CreateUserRequest, CreateUserResponse } from "../models/request/CreateUserRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


const createUser = (request: CreateUserRequest) => {
   var myHeaders = new Headers();
   myHeaders.append("Content-Type", "application/json");

   var raw = JSON.stringify(
      request
      //    {
      //   "nickname": "adam",
      //   "email": "adam.szr98@email.com",
      //   "password": "adam"
      // }
   );

   var requestOptions: RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
   };


   return ax<CreateUserResponse>(Endpoints.sign, 'PUT', request)
}

export default createUser