import { Box, Button, Link, Paper } from "@mui/material";
import { useRouter } from "next/router";



// pages/500.js
export default function Custom500() {
    const router = useRouter()
    return <>
        <Box>500 - Server-side error occurred</Box>
        <Box>500 - Wystąpił błąd po stronie serwera. </Box>
        <Box display={'flex'} justifyContent={'center'} >
            <Button variant='outlined' onClick={() => { router.push('/') }}>
                Powrót
            </Button>
        </Box>
    </>
}