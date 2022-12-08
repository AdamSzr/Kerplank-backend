import { Divider } from "@mui/material"
import { useEffect, useState } from "react"
import downloadUsers, { UserListResponse } from "../api/download-user-list"

const UsersComponent = () => {

    const [userList, setUserList] = useState<undefined | UserListResponse>()


    useEffect(() => {
        downloadUsers().then(response => {
            console.log(response.data)
            setUserList(response.data)
        })


    }, [])


    return <>
        Users
        <Divider />
        {userList ? JSON.stringify(userList) : ""}
    </>
}

export default UsersComponent