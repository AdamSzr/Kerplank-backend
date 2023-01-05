import { Alert, Button, Divider, Input, InputAdornment, TextField } from "@mui/material"
import { useRouter } from "next/router"
import { NextRequest, NextResponse } from "next/server"
import { ReactNode, useState } from "react"
import { login } from "../src/features/api/login-fetch"
import { jwtTokenStorage } from "../src/features/config"




const LoginPage = () => {
    const [nickname, setNickname] = useState<string>("")
    const [password, setPassw] = useState<string>("")

    const [alert, setAlert] = useState<undefined | ReactNode>()


    const router = useRouter()

    const createFailLoginAlert = (message?: string) => {
        setAlert(<Alert severity="error" onClick={() => setAlert(undefined)}>  {message ?? `Logowanie nie powiodło się`} </Alert>)
    }

    const onLoginClick = async () => {
        try {
            const loginResponse = await login({  nickname, password, type: "NICKNAME" })
            if (loginResponse)
                console.log(loginResponse)
            if (loginResponse.result == 'ok') {
                jwtTokenStorage.set(loginResponse.token)
                router.push("/")
            } else {
                createFailLoginAlert()
            }
        } catch (exception:any) {
            createFailLoginAlert(exception.message)
        }

    }

    return (
        <div >
            <TextField
                onChange={(event) => setNickname(event.target.value)}
                id="outlined-start-adornment"
                sx={{ m: 1, width: '25ch' }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">email</InputAdornment>,
                }}
            />
            <TextField
                onChange={(event) => setPassw(event.target.value)}
                id="outlined-start-adornment"
                sx={{ m: 1, width: '25ch' }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">hasło</InputAdornment>,
                }}
            />
            <Button onClick={onLoginClick}>zaloguj</Button>
            <Divider />

            {alert}
        </div>
    )
}

export default LoginPage


