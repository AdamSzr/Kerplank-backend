import { Alert, Button, TextField, Avatar, CssBaseline, Grid, Box, Typography, Container } from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from "next/router"
import { ReactNode, useState } from "react"
import createUser from "../src/features/api/create-user-fetch"
import * as React from "react";

// function homePage(props: any) {
//     return (
//         <Typography variant="body2" color="text.secondary" align="center" {...props}>
//
//             <Link color="inherit" href="http://localhost:3000/">
//                 Strona główna
//             </Link>
//         </Typography>
//     );
// }

const theme = createTheme();

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
            if (loginResponse.data.result == 'ok') {
                console.log(loginResponse)
                setAlert(<Alert severity='success' onClick={() => setAlert(undefined)}>  {JSON.stringify(loginResponse.data.user)} </Alert>)
            }
            setTimeout(() => {
                router.push('/login')
            }, 3000);

        } catch (exception: any) {
            createFailLoginAlert(exception.message)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        border: 3,
                        borderRadius: 5,
                        borderColor: 'primary.main',
                        Width: 420,
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{
                        m: 1,
                        marginTop: 2,
                        bgcolor: 'primary.main'
                    }}></Avatar>
                    <Typography component="h1" variant="h5" fontWeight="bold">
                        Zarejestruj się
                    </Typography>
                    <Box component="form"
                         sx={{
                             width: 350,
                         }}>
                        <TextField
                            onChange={(event) => setNickName(event.target.value)}
                            margin="normal"
                            required
                            fullWidth
                            label="NickName"
                            name="email"
                            autoFocus
                        />
                        <TextField
                            onChange={(event) => setEmail(event.target.value)}
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            autoFocus
                        />
                        <TextField
                            onChange={(event) => setPassw(event.target.value)}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Hasło"
                            type="password"
                        />
                        <Button
                            onClick={onSignUpClick}
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Zarejestruj się
                        </Button>
                        {alert}

                        <Grid
                            sx={{
                                margin: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <Typography
                                sx={{
                                    marginBottom: 1,
                                }}>
                                Posiadasz konto?
                            </Typography>
                            <Button
                                href="/login"
                                variant="contained"
                                color="secondary"
                            >
                                Zaloguj się
                            </Button>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>

    );
}

export default SignUp



