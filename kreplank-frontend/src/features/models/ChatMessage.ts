import { Project } from "./Project"
import { Task } from "./Task"

export type BaseMessage = {
    id: string,
    from: string,
}

export type ChatDataMessage<T extends BaseMessage> = {
    data: T,
}


export type SimpleChatMessage = { message: string } & BaseMessage

const exampleMessage: ChatDataMessage<SimpleChatMessage> = { data: { from: "frontend", id: "#1234", message: "halo" } }



export type BaseBoardAction = {
    type:"update"
    project?:Project,
    task?:Task,
}


// export type CharPostRequest = Pick<ChatMessage, 'author' | 'content'>
