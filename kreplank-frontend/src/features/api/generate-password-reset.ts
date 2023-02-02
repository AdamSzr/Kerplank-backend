import { Endpoints } from "../config"
import { ax } from "./ax"



  export function generatePasswordReset(email:string) {
      return ax(Endpoints["password.reset"]+`?email=${email}`,"GET")
  }
