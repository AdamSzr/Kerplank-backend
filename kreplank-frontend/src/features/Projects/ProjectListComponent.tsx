import { Button, Divider, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import getProjectsList, { ProjectListResponse } from "../api/download-project-list"
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { User } from "../models/User";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { Project } from "../models/Project";
import { ProjectViewContext } from "./ProjectsComponent";

import Link from '@mui/material/Link';

const ProjectListComponent = () => {

    const ctx = useContext(ProjectViewContext)

    const [projectsList, setProjectList] = useState<undefined | Project[]>()

    useEffect(() => {
        setProjectList(ctx.projectList)
    }, [ctx.projectList]
    )

    const onProjectIdClick = (projectId: string) => {
        console.log(projectId)
        ctx.setSelectedProjectId(projectId)
        ctx.setViewStage("project-instance")
    }

    const onTaskClick = (taskId: string) => {
        ctx.setSelectedTaskId(taskId)
        ctx.setViewStage('task-instance')
    }

    const createFileLink = (path: string) => {
        return <Link key={path} href={path} >
            {path}
        </Link>
    }



    const createRow = (project: Project) => {
        return <StyledTableRow key={`project-table-row-${project.id}`}>
            <StyledTableCell><Button onClick={() => { onProjectIdClick(project.id) }}>{project.id.substring(0, 6)}</Button></StyledTableCell>
            <StyledTableCell>{project.title}</StyledTableCell>
            <StyledTableCell>{project.description}</StyledTableCell>
            <StyledTableCell>{project.dateTimeCreation}</StyledTableCell>
            <StyledTableCell>{project.dateTimeDelivery}</StyledTableCell>
            <StyledTableCell>{project.status}</StyledTableCell>
            <StyledTableCell>
                {
                    project.tasks.length > 0 ?
                        project.tasks.map((task) => {
                            return <Typography key={task.id}>
                                <Button onClick={() => { onTaskClick(task.id) }}>{task.title} </Button>
                            </Typography>
                        }) :
                        "brak"
                }
            </StyledTableCell>
            <StyledTableCell>
                {project.users.map((nickname) => {
                    return <Typography key={nickname}>{nickname}</Typography>
                })}
            </StyledTableCell>
            <StyledTableCell>{project.files.map(it => createFileLink(it))}</StyledTableCell>
        </StyledTableRow>
    }

    if (!projectsList)
        return <div>Ładowanie</div>


    return (
        <Paper>
            <Button onClick={() => { ctx.setViewStage('project-create') }}> utworz projekt</Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300, maxWidth: 1000 }} aria-label="customized table">
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
                        {projectsList.map((project) => createRow(project))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
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

export default ProjectListComponent