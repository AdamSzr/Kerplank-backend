import { Typography, Box, Button, createTheme, ThemeProvider, CssBaseline, Container } from "@mui/material";
        import { useRouter } from "next/router";

        const theme = createTheme();

        export default function Custom500() {
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
                500 - Błąd po stronie serwera
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
                <img src="https://planetagracza.pl/wp-content/uploads/2021/03/pozar-ovh-pg.jpg"
                     alt="ovh_burn"
                />
            </Box>
        </Box>

        </Container>
        </ThemeProvider>
    )
}