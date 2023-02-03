import { Typography, Box, Button, createTheme, ThemeProvider, CssBaseline, Container } from "@mui/material";
import { useRouter } from "next/router";

const theme = createTheme();

export default function Custom404() {
    const router = useRouter()
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
            }}>
        <Typography component="h1" variant="h5">
            404 - Strony nie znaleziono
        </Typography>

            <Button
                sx={{
                marginTop: 4
                }}
                variant='contained' onClick={() => { router.push('/') }}>
            Powrót do strony głównej
            </Button>
            <Box
                sx={{
                marginTop: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <img src="https://www.womansworld.com/wp-content/uploads/2018/05/sad-cat-luhu.jpg?w=715"
                alt="sadCatImage"
                />
            </Box>
        </Box>

        </Container>
        </ThemeProvider>
    )
}