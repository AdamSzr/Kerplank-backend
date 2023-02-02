
export type ChatPost = {
    id: string,
    author: string,
    created: string,
    content: string
}


export type CharPostRequest = Pick<ChatPost, 'author' | 'content'>
