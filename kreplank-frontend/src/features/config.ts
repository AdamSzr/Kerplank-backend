import useStorage from "./hooks/useStorage"


export const backendUrlStorage = useStorage<string>('kerplank-backend-url')
export const jwtTokenStorage = useStorage<string>('kerplank-jwt')



export class Endpoints {
   static login = '/api/user/login'
   static userMe = '/api/user/me'
   static sign = '/api/user/signup'
}

