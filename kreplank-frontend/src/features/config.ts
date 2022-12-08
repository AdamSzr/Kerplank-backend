import useStorage from "./hooks/useStorage"


export const backendUrlStorage = useStorage<string>('kerplank-backend-url')
export const jwtTokenStorage = useStorage<string>('kerplank-jwt')



export class Endpoints {
   static login = '/api/user/login'
   static userMe = '/api/user/me'
   static sign = '/api/user/signup'
   static project = '/api/project'
   static "edit.project" = '/api/project/:projectId:'
   static "edit.task" = '/api/project/task'
   static ping = '/api/ping'
   static "users.all" = '/api/user/all'
   static "edit.user" = '/api/user/:nickname:'
   static "drive.directory" = '/api/drive/directory'
   static "drive.file" = '/api/drive/file'
   static "drive.path" = '/api/drive/path'
   static "drive.upload" = '/api/drive/upload'
}


export const DEV_MODE = true