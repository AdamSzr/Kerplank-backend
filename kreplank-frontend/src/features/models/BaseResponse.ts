
export type BaseResponse = {
    result: 'ok' | 'fail'
}


export type ListResponse<T> = { list: T[] }