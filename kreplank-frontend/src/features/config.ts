import useStorage from "./hooks/useStorage"
import { User } from "./models/User"


export const backendUrlStorage = useStorage<string>('kerplank-backend-url')
export const jwtTokenStorage = useStorage<string>('kerplank-jwt')
export const userStorage = useStorage<User>('kerplank-user')



export class Endpoints {
   static login = '/api/user/login'
   static userMe = '/api/user/me'
   static signup = '/api/user/signup'

   static 'delete.user' = '/api/user/:userId:'
   static 'my.project' = '/api/project/my'
   static 'create.project' = '/api/project'
   static "edit|delete.project" = '/api/project/:projectId:'
   static "edit.task" = '/api/project/task/:taskId:'
   static "create.task" = '/api/project/task'
   static ping = '/api/ping'
   static "users.all" = '/api/user/all'
   static "edit.user" = '/api/user/:nickname:'
   static "drive.directory" = '/api/drive/directory'
   static "drive.file" = '/api/drive/file'
   static "drive.path" = '/api/drive/path'
   static "drive.upload" = '/api/drive/upload'
}


export const DEV_MODE = true