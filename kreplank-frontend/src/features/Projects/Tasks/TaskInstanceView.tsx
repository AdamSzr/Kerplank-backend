import { Box, Button, Typography } from '@mui/material'
import { it } from 'node:test'
import React, { useContext, useEffect, useState } from 'react'
import { Project } from '../../models/Project'
import { Task } from '../../models/Task'
import { ProjectViewContext } from '../ProjectsComponent'

const TaskInstanceView = () => {
    const ctx = useContext(ProjectViewContext)


    const [task, setTask] = useState<Task | undefined>()

    useEffect(() => {

        if (ctx.selectedTaskId && ctx.projectList) {
            const doesProjContainTask = (project: Project): boolean => {
                return project.tasks.some(task => task.id == ctx.selectedTaskId)
            }

            const project = ctx.projectList.find(it => doesProjContainTask(it))
            if (!project)
                return

            const task = project.tasks.find(task => task.id == ctx.selectedTaskId)
            if (!task)
                return

            console.log(task)
            setTask(task)

        }

    }, [ctx.setSelectedTaskId])


    const backToList = () => {
        ctx.setViewStage('project-list')
        ctx.setSelectedTaskId(undefined)
    }

    return (
        <Box>
            TaskInstanceView
            <Typography>
                task id -{ctx.selectedTaskId}
            </Typography>
            <Typography>
               title - {task?.title}
            </Typography>
            <Button onClick={backToList}> wroc</Button>
        </Box>
    )
}

export default TaskInstanceView