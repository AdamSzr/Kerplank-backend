import axios from "axios";
import { backendUrlStorage, jwtTokenStorage } from "../config";

export function ax<T>(endpoint: string, method?: "GET" | 'POST' | 'PUT' | "DELETE", body?: object, query?: object, headers?:RawAxiosHeaders) {
    const host = backendUrlStorage.getOrThrow()
    const path = () => {
        let queryStr: string | undefined
        if (query)
            queryStr = '?' + Object.entries(query).map(arr => `${arr[0]}=${arr[1]}`).join('&')

        return host + endpoint + (queryStr ?? "")
    }
    const header = { "Authorization": jwtTokenStorage.tryGet(), 'content-type': "application/json", ...headers }
    

    console.log(`${method ?? "GET"} [${endpoint}]`, body)

    if (!method || method == 'GET')
        return axios.get<T>(path(), { headers: header })

    if (method == 'DELETE')
        return axios.delete<T>(path(), { headers: header })

    if (!body)
        throw Error("Methods 'POST' & 'PUT' require's body")

    if (method == 'POST') {
        console.log("posting ->", header)
        return axios.post<T>(path(), JSON.stringify(body), { headers: header })
    }

    if (method == 'PUT') {
        console.log('put ->', path(), { body: JSON.stringify(body), headers: header })
        return axios.put<T>(path(), JSON.stringify(body), { headers: header })
    }

    throw Error('REPAIR function `ax` because all ifs failed')

}