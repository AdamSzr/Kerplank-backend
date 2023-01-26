import { Box, Button, Divider, Typography, Container } from '@mui/material'
import Link from 'next/link'
import { text } from 'node:stream/consumers'
import React, { useContext, useEffect, useState } from 'react'
import projectDelete from '../api/delete-project-fetch'
import { Project } from '../models/Project'
import { Task } from '../models/Task'
import { replaceItemInArray } from '../utils/ArrayUtils'
import ProjectAddUserComponent from './ProjectAddUserComponent'
import ProjectFileUploadComponent from './ProjectFileUploadComponent'
import { ProjectViewContext } from './ProjectsComponent'

const ProjectInstanceComponent = () => {

    const ctx = useContext(ProjectViewContext)
    const [project, setProject] = useState<Project | undefined>()
    const [activeView, setActiveView] = useState<"project-details" | 'add-user' | 'upload-file' | 'file-list'>('project-details')

    useEffect(() => {
        if (ctx.selectedProjectId) {
            const projectEntity = ctx.projectList?.find(project => project.id == ctx.selectedProjectId)
            if (projectEntity) {
                setProject(projectEntity)
            }
        }
    }, [ctx.selectedProjectId, ctx.projectList])


    if (!ctx.selectedProjectId)
        return <Box> Ładowanie </Box>


    const deleteTask = async (projectId: string, taskId: string) => {
        if (!project) return

        const response = await projectDelete(projectId, { taskId })
        console.log(response)
        if (response.status == 200 && ctx.projectList) {
            console.log("delete task success", taskId)
            console.log(replaceItemInArray(ctx.projectList, response.data.project, (item) => item.id == projectId))
            ctx.setProjectList([...replaceItemInArray(ctx.projectList, response.data.project, (item) => item.id == projectId)])
        } else {
            console.log("FAILED")
        }
    }

    const deleteProject = async () => {
        if (!project) return

        const response = await projectDelete(project.id)
        if (response.status == 200) {
            console.log("delete project success", project.id)

            const newProjectList = ctx.projectList?.filter(it => it.id != project.id) ?? []
            console.log({ newProjectList })
            ctx.setViewStage('project-list')
            ctx.setProjectList(newProjectList)
            ctx.setSelectedProjectId(undefined)
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
            <Typography fontWeight="bold" sx={{ marginRight: 1 }}>{task.title}</Typography>
            <Button sx={{ marginRight: 1 }} variant="contained" color="warning" onClick={() => { ctx.setSelectedTaskId(task.id); ctx.setViewStage('task-instance') }}>Szczegóły</Button>
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

    const showFiles = () => {
        setActiveView('file-list')
    }


    const FileListComponent = () => {
        return <>
            {project?.files.map(file => <div key={file} ><Link href={file}>{file}</Link></div>)}
        </>
    }


    // console.log({ activeView })

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
            <Typography component={'h2'} fontSize={'30px'} > Projekt: {project?.title} </Typography>
            <Box
                sx={{
                }}>
                <Box sx={{ marginBottom: 2, marginLeft: 2, alignItems: 'center', display: 'flex' }}>
                    <Button sx={{ marginRight: 1 }} variant="contained" color="warning" onClick={createTask}>
                        utworz zadanie
                    </Button>
                    <Button sx={{ marginRight: 1 }} variant="contained" color="primary" onClick={onAddUsersClick}>
                        dodaj/usun użytkowników
                    </Button>
                    <Button sx={{ marginRight: 1 }} variant="contained" color="primary" onClick={onAddFileClick}>
                        dodaj plik
                    </Button>
                    <Button sx={{ marginRight: 1 }} onClick={showFiles} variant="contained" color="primary">Pliki</Button>
                    <Button sx={{ marginRight: 1 }} variant="contained" color="error" onClick={deleteProject}>
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

                {activeView == 'upload-file' ? <ProjectFileUploadComponent project={project} /> : ''}
                {activeView == 'add-user' ? <ProjectAddUserComponent project={project} /> : ""}
                {activeView == 'file-list' ? <FileListComponent /> : ""}
            </Box>
        </Container>
    )
}

export default ProjectInstanceComponent