import { Alert, Button, Divider, Input, InputAdornment, TextField } from "@mui/material"
import { useRouter } from "next/router"
import { NextRequest, NextResponse } from "next/server"
import { ReactNode, useState } from "react"
import { login } from "../src/features/api/login-fetch"
import { jwtTokenStorage } from "../src/features/config"




const LoginPage = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassw] = useState<string>("")

    const [alert, setAlert] = useState<undefined | ReactNode>()


    const router = useRouter()

    const createFailLoginAlert = (message?: string) => {
        setAlert(<Alert severity="error" onClick={() => setAlert(undefined)}>  {message ?? `Logowanie nie powiodło się`} </Alert>)
    }

    const onLoginClick = async () => {
        try {
            const loginResponse = await login({ email, password, type: "EMAIL" })
            if (loginResponse.data)
                console.log(loginResponse)
            if (loginResponse.data.result == 'ok') {
                jwtTokenStorage.set(loginResponse.data.token)
                router.push("/home")
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
                onChange={(event) => setEmail(event.target.value)}
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


