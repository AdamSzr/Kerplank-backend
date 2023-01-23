import { Box, Button, Divider } from '@mui/material'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { ax } from '../api/ax'
import projectDelete from '../api/delete-project-fetch'
import { Endpoints } from '../config'
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
        return <Box key={task.id} >
            <Box>
                {task.title} <Button onClick={() => { ctx.setSelectedTaskId(task.id); ctx.setViewStage('task-instance') }} > szczegóły</Button>

            </Box>
            <Button onClick={() => onDeleteTaskClick(task)}>delete - task</Button>
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
        <Box>
            ProjectInstanceComponent
            <Button onClick={deleteProject}> usun projekt </Button>
            <Button onClick={createTask}>
                utworz zadanie
            </Button>
            <Button onClick={onAddUsersClick}>
                dodaj/usun użytkowników
            </Button>
            <Button onClick={onAddFileClick}>
                dodaj plik
            </Button>
            <Box>
                Lista tasków
                <Divider />
                {project?.tasks.map(task => taskItemComponent(task))}
            </Box>

            <Button onClick={onBackClick}>wróć</Button>
            <Divider />
            {activeView == 'upload-file' ? <ProjectFileUploadComponent  project={project}/>:'' }

            {activeView == 'add-user' ? <ProjectAddUserComponent project={project} />:""}
        </Box>
    )
}

export default ProjectInstanceComponent