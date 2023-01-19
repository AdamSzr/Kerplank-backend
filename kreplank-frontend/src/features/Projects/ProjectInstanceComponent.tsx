import { Box } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { ProjectViewContext } from './ProjectsComponent'
import { Button, Divider, Typography } from "@mui/material"
import { Project } from '../models/Project'
import { Task } from '../models/Task'
import projectDelete from '../api/delete-project-fetch'

const ProjectInstanceComponent = () => {

    const ctx = useContext(ProjectViewContext)

    const [project, setProject] = useState<Project | undefined>()

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
            {task.title}
            <Button onClick={() => onDeleteTaskClick(task)}>delete - task</Button>
        </Box>
    }

    const createTask = () =>{
        ctx.setViewStage('task-create')
    }

    return (
        <Box>
            ProjectInstanceComponent
            <Button onClick={deleteProject}> usun projekt </Button>
            <Button onClick={createTask}>
                utworz zadanie
            </Button>
            <Box>
                Lista tasków
                <Divider />
                {project?.tasks.map(task => taskItemComponent(task))}
            </Box>

            <Button onClick={onBackClick}>wróć</Button>
        </Box>
    )
}

export default ProjectInstanceComponent