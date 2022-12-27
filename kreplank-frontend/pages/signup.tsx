import { Alert, Button, Divider, Input, InputAdornment, TextField } from "@mui/material"
import { useRouter } from "next/router"
import { NextRequest, NextResponse } from "next/server"
import { ReactNode, useState } from "react"
import createUser from "../src/features/api/create-user-fetch"




const SignUp = () => {
    const [email, setEmail] = useState<string>("")

    const [nickName, setNickName] = useState<string>("")
    const [password, setPassw] = useState<string>("")

    const [alert, setAlert] = useState<undefined | ReactNode>()


    const router = useRouter()

    const createFailLoginAlert = (message?: string) => {
        setAlert(<Alert severity="error" onClick={() => setAlert(undefined)}>  {message ?? `Logowanie nie powiodło się`} </Alert>)
    }

    const onSignUpClick = async () => {
        try {
            const loginResponse = await createUser({ email, password, nickname: nickName })
            if (loginResponse.result == 'ok') {
                console.log(loginResponse)
                setAlert(<Alert severity='success' onClick={() => setAlert(undefined)}>  {JSON.stringify(loginResponse.user)} </Alert>)
            }
            setTimeout(() => {
                router.push('/login')
            }, 3000);

        } catch (exception: any) {
            createFailLoginAlert(exception.message)
        }
    }

    return (
        <div >
            <TextField
                onChange={(event) => setNickName(event.target.value)}
                id="outlined-start-adornment"
                sx={{ m: 1, width: '25ch' }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">nazwa użytkownika</InputAdornment>,
                }}
            />
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

            <Button onClick={onSignUpClick}>Zaloz konto</Button>
            <Divider />

            {alert}
        </div>
    )
}

export default SignUp


