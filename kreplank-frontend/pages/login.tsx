import * as React from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from "next/router"
import { ReactNode, useState } from "react"
import { login } from "../src/features/api/login-fetch"
import { jwtTokenStorage } from "../src/features/config"


function homePage(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>

            <Link color="inherit" href="/">
                Strona główna
            </Link>
        </Typography>
    );
}

const theme = createTheme();

const LoginPage = () => {
    const [nickname, setNickname] = useState<string>("")
    const [password, setPassw] = useState<string>("")

    const [alert, setAlert] = useState<undefined | ReactNode>()

    const router = useRouter()

    const createFailLoginAlert = (message?: string) => {
        setAlert(<Alert severity="error" onClick={() => setAlert(undefined)}>  {message ?? `Logowanie nie powiodło się`}</Alert>)
    }

    const onLoginClick = async () => {
        try {
            const loginResponse = await login({ nickname, password, type: "NICKNAME" })
            if (!loginResponse.data)
                console.log(loginResponse)
            if (loginResponse.data.result == 'ok') {
                jwtTokenStorage.set(loginResponse.data.token)
                router.push("/")
            } else {
                createFailLoginAlert()
            }
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
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
                    <Typography component="h1" variant="h5">
                        Zaloguj się
                    </Typography>
                    <Box component="form">
                        <TextField
                            onChange={(event) => setNickname(event.target.value)}
                            margin="normal"
                            required
                            fullWidth
                            label="Nick"
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
                            onClick={onLoginClick}
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Zaloguj się
                        </Button>
                        {alert}

                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Resetowanie Hasła
                                </Link>
                            </Grid>
                            <Grid item >
                                <Link href="#" variant="body2">
                                    {"Zarejestruj się"}
                                </Link>
                            </Grid>
                        </Grid>
                        <Grid
                            sx={{
                                marginTop: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Link href="#" variant="body2">
                                {"Strona Główna"}
                            </Link>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>

    );
}

export default LoginPage