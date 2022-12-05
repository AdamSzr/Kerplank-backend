import useStorage from "./hooks/useStorage"


export const backendUrlStorage = useStorage<string>('kerplank-backend-url')
export const jwtTokenStorage = useStorage<string>('kerplank-jwt')



export class Endpoints {
   static login = '/api/user/login'
   static userMe = '/api/user/me'
   static sign = '/api/user/signup'
   static project = '/api/project/project'
   static projectId = '/api/project/projectId'
   static task = '/api/project/task'
   static ping = '/api/ping'
   static send = '/api/email/send'
   static all = '/api/user/all'
   static nickName = '/api/user/nickname'
   static directory = '/api/drive/directory'
   static file = '/api/drive/file'
   static path = '/api/drive/path'
   static upload = '/api/drive/upload'
}


export const DEV_MODE = true