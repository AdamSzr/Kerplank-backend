import {Box, Button, Divider, Typography, Container} from '@mui/material'
import React, {useContext, useEffect, useState } from 'react'
import projectDelete from '../api/delete-project-fetch'
import { Project } from '../models/Project'
import { Task } from '../models/Task'
import ProjectAddUserComponent from './ProjectAddUserComponent'
import ProjectFileUploadComponent from './ProjectFileUploadComponent'
import { ProjectViewContext } from './ProjectsComponent'

const ProjectInstanceComponent = () => {

    const ctx = useContext(ProjectViewContext)
    const [project, setProject] = useState<Project | undefined>()
    const [activeView, setActiveView] = useState<"project-details" | 'add-user' | 'upload-file'>('project-details')

    useEffect(() => {
        if (ctx.selectedProjectId) {
            const projectEntity = ctx.projectList?.find(project => project.id == ctx.selectedProjectId)
            if (projectEntity) {
                setProject(projectEntity)
            }
        }
    }, [ctx.selectedProjectId])


    if (!ctx.selectedProjectId)
        return <Box> Ładowanie </Box>


    const deleteTask = async (projectId: string, taskId: string) => {
        if (!project) return

        const response = await projectDelete(projectId, { taskId })
        console.log(response)
        if (response.status == 200) {
            console.log("delete task success", taskId)

        } else {
            console.log("FAILED")
        }
    }

    const deleteProject = async () => {
        if (!project) return

        const response = await projectDelete(project.id)
        if (response.status == 200) {
            console.log("delete project success", project.id)
        } else {
            console.log("FAILED")
            console.log({ response })
        }
    }

    const onBackClick = () => {
        ctx.setSelectedProjectId(undefined)
        ctx.setViewStage('project-list')
    }


    const onDeleteTaskClick = (task: Task) => {
        if (project)
            deleteTask(project.id, task.id)
    }

    const taskItemComponent = (task: Task) => {
        return <Box
            sx={{
                marginTop: 2,
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                minWidth: 700,
        }}
            key={task.id} >
            <Typography fontWeight="bold" sx={{marginRight: 1}}>{task.title}</Typography>
            <Button sx={{marginRight: 1}} variant="contained" color="warning" onClick={() => { ctx.setSelectedTaskId(task.id); ctx.setViewStage('task-instance') }}>Szczegóły</Button>
            <Button variant="contained" color="error" onClick={() => onDeleteTaskClick(task)}>Usuń zadanie</Button>
        </Box>
    }

    const createTask = () => {
        ctx.setViewStage('task-create')
    }

    const onAddUsersClick = () => {
        console.log("add user clicked")
        setActiveView('add-user')
    }
    const onAddFileClick = () => {
        setActiveView('upload-file')
    }

    console.log({activeView})

    return (
        <Container
            sx={{
                marginTop: 2,
                marginBottom: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2
        }}>
            <Box
                sx={{
                }}>
                <Box sx={{marginBottom: 2, marginLeft: 2, alignItems: 'center', display: 'flex'}}>
                    <Button sx={{marginRight: 1}} variant="contained" color="warning" onClick={createTask}>
                        utworz zadanie
                    </Button>
                    <Button sx={{marginRight: 1}} variant="contained" color="primary" onClick={onAddUsersClick}>
                        dodaj/usun użytkowników
                    </Button>
                    <Button sx={{marginRight: 1}} variant="contained" color="primary" onClick={onAddFileClick}>
                        dodaj plik
                    </Button>
                    <Button sx={{marginRight: 1}}variant="contained" color="error" onClick={deleteProject}>
                        Usuń projekt
                    </Button>
                </Box>
                <Box>
                    <Typography fontWeight="bold">Lista zadań</Typography>
                    <Divider />

                    {project?.tasks.map(task => taskItemComponent(task))}
                </Box>
            </Box>
            <Button variant="contained" color="success" onClick={onBackClick}>Wróć do listy projektów</Button>
            <Box
                sx={{
                    marginTop: 2,
                    marginBottom: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    minWidth: 700,
                }}>

                {activeView == 'upload-file' ? <ProjectFileUploadComponent  project={project}/>:'' }
                {activeView == 'add-user' ? <ProjectAddUserComponent project={project} />:""}
            </Box>
        </Container>
    )
}

export default ProjectInstanceComponent