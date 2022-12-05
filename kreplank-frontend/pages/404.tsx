import { Box, Button, Link, Paper } from "@mui/material";
import { useRouter } from "next/router";
export default function Custom404() {
    const router = useRouter()
    return <>
        <Box>404 - Page Not Found</Box>
        <Box>404 - Strony nie znaleziono. </Box>
        <Box display={'flex'} justifyContent={'center'}>
            <Button variant='outlined' onClick={() => { router.push('/') }}>
                Powrót
            </Button>
        </Box>
    </>
}