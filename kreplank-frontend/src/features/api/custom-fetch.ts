import { backendUrlStorage, jwtTokenStorage } from "../config"
import axios, { isCancel, AxiosError } from 'axios';



export function customFetch<T>(relativeUrl: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, token?: string): Promise<T> {
    const url = backendUrlStorage.getOrThrow() + relativeUrl
    console.log({ url, method, body })



    if (!method || method == 'GET')
        return axios.get(url)

    const headers = { headers: { 'content-type': "application/json", 'Authorization': token ?? jwtTokenStorage.tryGet() } }
    if (method == 'POST' && body) {
        return axios.post(url, JSON.stringify(body), headers)
    }

    if (method == 'PUT' && body) {
        return axios.put(url, JSON.stringify(body), headers)
    }

    if (method == 'DELETE') {
        return axios.delete(url, { headers })
    }

    throw Error('Somethink goes wrong with fetch')

}