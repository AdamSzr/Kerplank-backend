import { User } from "./User"

export type Task = {
    "id": string,
    "title": string,
    "description": string,
    "assignedTo"?: string,
    "dateTimeCreation":string,
    "dateTimeDelivery": string,
    "status": "NEW"|"IN_PROGRESS"|"DONE"
}