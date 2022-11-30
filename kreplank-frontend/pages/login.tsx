import { Button, Input, InputAdornment, TextField } from "@mui/material"
import { NextRequest, NextResponse } from "next/server"
import { useState } from "react"
import { login } from "../src/features/api/login-fetch"




const LoginPage = () => {
    const [email, setEmail] = useState<string | undefined>()
    const [password, setPassw] = useState<string | undefined>()



    const onLoginClick = async () => {
        if (!email || !password)
            throw Error("Email and password should not be blank")

        const loginResponse = await login({ email, password, type: "EMAIL" })
        console.log(loginResponse)
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
        </div>
    )
}

export default LoginPage


