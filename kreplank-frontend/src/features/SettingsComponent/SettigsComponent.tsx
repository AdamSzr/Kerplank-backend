import { Divider} from "@mui/material"
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

const SettingsComponent = () => {
    const [me, setMe] = useState<UserMe | undefined>()

    useEffect(() => {
        whoAmI().then(response => {
            console.log(response)
            setMe(response.data)
        })
    }, [])

    if (!me) return <div>Ładowanie</div>

    return (
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