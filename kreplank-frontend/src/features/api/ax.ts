import axios from "axios";
import { backendUrlStorage, jwtTokenStorage } from "../config";

export function ax<T>(endpoint: string, method?: "GET" | 'POST' | 'PUT' | "DELETE", body?: object) {
    const host = backendUrlStorage.getOrThrow()
    const path = () => host + endpoint
    const header = { "Authorization": jwtTokenStorage.tryGet(), 'content-type':"application/json" }

    console.log(`${method ?? "GET"} [${endpoint}]`, body)

    if (!method || method == 'GET')
        return axios.get<T>(path(), { headers: header })

    if (method == 'DELETE')
        return axios.delete<T>(path(), { headers: header })

    if (!body)
        throw Error("Methods 'POST' & 'PUT' require's body")

    if (method == 'POST')
        return axios.post<T>(path(), { body: JSON.stringify(body), headers: header })

    if (method == 'PUT') {
        console.log('put ->',path(), { body: JSON.stringify(body), headers: header })
        return axios.put<T>(path(), { body: body, headers: header })
    }

    throw Error('REPAIR function `ax` because all ifs failed')

}