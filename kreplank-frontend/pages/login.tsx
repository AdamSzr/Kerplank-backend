import { Alert, Button, TextField, Avatar, CssBaseline, Grid, Box, Typography, Container } from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from "next/router"
import { ReactNode, useState } from "react"
import { login } from "../src/features/api/login-fetch"
import { jwtTokenStorage, userStorage } from "../src/features/config"

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
                userStorage.set(loginResponse.data.user)
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
                        border: 3,
                        borderRadius: 5,
                        borderColor: 'secondary.main',
                        Width: 420,
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main', marginTop: 2 }}></Avatar>
                    <Typography component="h1" variant="h5" fontWeight="bold">
                        Zaloguj się
                    </Typography>
                    <Box component="form"
                         sx={{
                             width: 350,
                         }}
                    >
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

                        <Grid
                            sx={{
                                margin: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                            sx={{
                                marginBottom: 1,
                            }}>
                                Nie posiadasz konta?
                            </Typography>
                            <Button
                                sx={{
                                    marginBottom: 2,
                                }}
                                href="/signup"
                                variant="contained"
                                color="secondary"
                            >
                                Zarejestruj się
                            </Button>

                            <Typography
                                sx={{
                                    marginBottom: 1,
                                }}>
                                Zapomniałeś hasła?
                            </Typography>
                            <Button
                                href="/password/reset"
                                variant="contained"
                                color="primary"
                            >
                                Zresetuj hasło
                            </Button>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default LoginPage