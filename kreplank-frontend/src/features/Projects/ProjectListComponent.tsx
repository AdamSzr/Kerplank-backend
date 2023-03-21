import { Button, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
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
        ctx.setSelectedProjectId(projectId)
        ctx.setViewStage("project-instance")
    }

    const onTaskClick = (projectId: string, taskId: string) => {
        ctx.setSelectedProjectId(projectId)
        ctx.setSelectedTaskId(taskId)
        ctx.setViewStage('task-instance')
    }

    const createFileLink = (path: string) => {
        return <div key={path} >
            <Link href={path} >
                {path}
            </Link>
        </div>
    }



    const createRow = (project: Project) => {
        return <StyledTableRow key={`project-table-row-${project.id}`}>
            <StyledTableCell><Button variant="contained" color="success" onClick={() => { onProjectIdClick(project.id) }}>{project.id.substring(0, 6)}</Button></StyledTableCell>
            <StyledTableCell><Typography fontWeight="bold">{project.title}</Typography></StyledTableCell>
            {/* <StyledTableCell>{project.description}</StyledTableCell> */}
            <StyledTableCell>{project.creator}</StyledTableCell>
            <StyledTableCell>{project.dateTimeCreation}</StyledTableCell>
            {/* <StyledTableCell>{project.dateTimeDelivery}</StyledTableCell> */}
            <StyledTableCell><Typography fontWeight="bold">{project.status}</Typography></StyledTableCell>
            {/* <StyledTableCell>
                {
                    project.tasks.length > 0 ?
                        project.tasks.map((task) => {
                            return <Typography key={task.id}>
                                <Button sx={{ marginTop: 0.5 }} variant="contained" color="success" onClick={() => { onTaskClick(project.id, task.id) }}>{task.title} </Button>
                            </Typography>
                        }) :
                        "brak"
                }
            </StyledTableCell> */}
            <StyledTableCell>
                {project.users.map((nickname) => {
                    return <Typography key={nickname}>{nickname.split('@')[0] ?? nickname}</Typography>
                })}
            </StyledTableCell>
            {/* <StyledTableCell>{project.files.map(it => createFileLink(it))}</StyledTableCell> */}
        </StyledTableRow>
    }

    if (!projectsList)
        return <div>Ładowanie</div>


    const showTaskList = () => {
        ctx.setViewStage('task-list')
    }

    return (
        <Paper>
            <Button sx={{ margin: 1 }} variant="contained" color="primary" onClick={() => { ctx.setViewStage('project-create') }}> Utwórz projekt</Button>
            <Button sx={{ margin: 1 }} variant="contained" color="primary" onClick={showTaskList}> list zadań</Button>
            <TableContainer component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell>Tytuł</StyledTableCell>
                            {/* <StyledTableCell>Opis</StyledTableCell> */}
                            <StyledTableCell>Właściciel</StyledTableCell>
                            <StyledTableCell>Data utworzenia</StyledTableCell>
                            {/* <StyledTableCell>Data dostarczenia</StyledTableCell> */}
                            <StyledTableCell>Status</StyledTableCell>
                            {/* <StyledTableCell>Zadania</StyledTableCell> */}
                            <StyledTableCell>Użytkownicy</StyledTableCell>
                            {/* <StyledTableCell>Pliki</StyledTableCell> */}
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
        backgroundColor: theme.palette.success.light,
        color: theme.palette.common.white,
        fontSize: 14,
        fontWeight: "bold"
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