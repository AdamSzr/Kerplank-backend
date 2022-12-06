import { useEffect, useState } from "react"
import whoAmI from "../api/user-me-fetch"
import { UserMe } from "../models/UserMe"

const SettingsComponent = () => {
    const [me, setMe] = useState<UserMe | undefined>()

    useEffect(() => {
        whoAmI().then(response => {
            console.log(response)
        })


    }, [])



    return <>
        settings component
        {me ?? ""}
    </>
}

export default SettingsComponent