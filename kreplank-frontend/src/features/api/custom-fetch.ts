import { backendUrlStorage, jwtTokenStorage } from "../config"
import axios, { isCancel, AxiosError } from 'axios';



export function customFetch<T>(relativeUrl: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, token?: string): Promise<T> {
    throw Error('Depricated')
}