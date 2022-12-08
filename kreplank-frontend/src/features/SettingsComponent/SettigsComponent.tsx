import { Divider } from "@mui/material"
import { useEffect, useState } from "react"
import whoAmI from "../api/user-me-fetch"
import { UserMe } from "../models/UserMe"

const SettingsComponent = () => {
    const [me, setMe] = useState<UserMe | undefined>()

    useEffect(() => {
        whoAmI().then(response => {
            console.log(response)
            setMe(response.data)
        })


    }, [])



    return <>
        settings component
        <Divider />
        {me ? JSON.stringify(me) : ""}
    </>
}

export default SettingsComponent