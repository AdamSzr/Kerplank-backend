import { backendUrlStorage } from "../config"


export function customFetch<T>(relaticeUrl: string, options?: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any }): Promise<T> {
    const url = backendUrlStorage.getOrThrow() + relaticeUrl
    const myHeaders = new Headers();


    var raw = JSON.stringify({
        "email": "random@email.com",
        "password": "adam123",
        "type": "EMAIL"
    });


    var requestOptions = {
        method: 'POST',
        headers: [["content-type", "application/json"]],
        body: raw,
        redirect: 'follow',
        mode: "no-cors"
    } as RequestInit
    console.log(requestOptions)

    fetch("http://192.168.1.22:8080/api/user/login", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));


    // const myHeaders = new Headers();

    // if (options?.body) {
    //     // check body type is string or object.
    //     const bodyJson = JSON.stringify(options.body)
    //     // myHeaders.set()
    //     options.body = bodyJson
    // }


    // let reqOptions = {
    //     method: options?.method ?? "GET",
    //     headers: { "Content-Type": "application/json" },
    //     mode: 'no-cors',
    //     body: options?.body ?? ""
    // } as RequestInit

    // console.log(url, reqOptions)
    // return fetch(url, reqOptions).then(it => it.json() as Promise<T>).then(jsonObject => {
    //     console.log("Response ->", { json: jsonObject })
    //     return jsonObject
    // })
}