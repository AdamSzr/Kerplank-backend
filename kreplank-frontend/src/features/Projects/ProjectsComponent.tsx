import { Divider } from "@mui/material"
import { useEffect, useState } from "react"
import getProjectsList, { ProjectListResponse } from "../api/download-project-list"
import {styled} from "@mui/material/styles";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {User} from "../models/User";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {Project} from "../models/Project";

const ProjectsComponent = () => {

    const [projectsList, setProjectList] = useState<undefined | ProjectListResponse>()

    useEffect(() => {
        getProjectsList().then(response => {
            setProjectList(response.data)
            console.log(response.data)
        })

    }, [])

    const createRow = (project: Project) => {
        return <StyledTableRow>
            <StyledTableCell>{project.id}</StyledTableCell>
            <StyledTableCell>{project.title}</StyledTableCell>
            <StyledTableCell>{project.description}</StyledTableCell>
            <StyledTableCell>{project.dateTimeCreation}</StyledTableCell>
            <StyledTableCell>{project.dateTimeDelivery}</StyledTableCell>
            <StyledTableCell>{project.status}</StyledTableCell>
            <StyledTableCell>{JSON.stringify(project.tasks.map((task)=>{
                return task.title
            }))}</StyledTableCell>
            <StyledTableCell>{JSON.stringify(project.users.map((user)=>{
                return user.nickname
            }))}</StyledTableCell>
            <StyledTableCell>{project.files}</StyledTableCell>
        </StyledTableRow>
    }

    if (!projectsList) return <div>Ładowanie</div>
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 300, maxWidth: 1000}} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell>Tytuł</StyledTableCell>
                        <StyledTableCell>Opis</StyledTableCell>
                        <StyledTableCell>Data utworzenia</StyledTableCell>
                        <StyledTableCell>Data dostarczenia</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>Zadania</StyledTableCell>
                        <StyledTableCell>Użytkownicy</StyledTableCell>
                        <StyledTableCell>Pliki</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projectsList.list.map((project) =>{
                        return createRow(project)
                    })}
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

export default ProjectsComponent