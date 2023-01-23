import { Box, Button, Divider } from "@mui/material"
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useEffect, useState } from "react"
import whoAmI from "../api/user-me-fetch"
import { UserMe } from "../models/UserMe"
import deleteAccount from "../api/user-delete-fetch"
import { off } from "process"
import { jwtTokenStorage, userStorage } from "../config"
import Router, { useRouter } from "next/router"

const SettingsComponent = () => {
    const [me, setMe] = useState<UserMe | undefined>()
    const router = useRouter()

    useEffect(() => {
        whoAmI().then(response => {
            console.log(response)
            setMe(response.data)
        })
    }, [])



    const onDeleteAccountClick = async () =>{
        if(!me)
        return
        
        const response = await deleteAccount(me.nickname)
        console.log({response})
        if(response.status==200){
            console.log("Delete user success")
            jwtTokenStorage.clear()
            userStorage.clear()
            router.push('/login')
        }

    }

    if (!me) return <div>Ładowanie</div>

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300, maxWidth: 1000 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Nazwa użytkownika</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Szczegóły</StyledTableCell>
                            <StyledTableCell>Wynik</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <StyledTableRow>
                            <StyledTableCell>{me.nickname}</StyledTableCell>
                            <StyledTableCell>{me.email}</StyledTableCell>
                            <StyledTableCell>{JSON.stringify(me.details)}</StyledTableCell>
                            <StyledTableCell>{me.result}</StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider />
            <Box>
                <Button onClick={onDeleteAccountClick}>
                    Usuń konto
                </Button>
            </Box>
        </Box>
    )
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },

    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default SettingsComponent