import { Box, Button, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import projectDelete from '../../api/delete-project-fetch'
import { Project } from '../../models/Project'
import { Task } from '../../models/Task'
import { ProjectViewContext } from '../ProjectsComponent'
import TaskEditComponent from './TaskEditComponent'

const TaskInstanceView = () => {
    const ctx = useContext(ProjectViewContext)

    const [task, setTask] = useState<Task | undefined>()

    useEffect(() => {

        if (ctx.selectedTaskId && ctx.projectList) {
            const task = tryFindTask(ctx.selectedTaskId)
            if (!task)
                return

            console.log(task)
            setTask(task)
        }

    }, [ctx.setSelectedTaskId])


    const tryFindTask = (taskId: string): Task | undefined => {
        if (ctx.projectList)
        {
            const project = tryFindProject(ctx.projectList, taskId)
            console.log({project})
            return project?.tasks.find(task => task.id == taskId)
        }
    }

    const tryFindProject = (projectList: Project[], taskId: string): Project | undefined => {
        const doesProjContainTask = (project: Project): boolean => {
            return project.tasks.some(task => task.id == taskId)
        }

        const project = projectList.find(it => doesProjContainTask(it))
        return project
    }


    const backToList = () => {
        ctx.setViewStage('project-list')
        ctx.setSelectedTaskId(undefined)
    }

    const deleteTask = async () => {
        console.log({ctx})
        if (!ctx.selectedProjectId || !task) return
        const response = await projectDelete(ctx.selectedProjectId, { taskId: task.id })
        console.log(response)
        if (response.status == 200) {
            console.log("delete task success", task.id)

        } else {
            console.log("FAILED")
        }
    }


    return (
        <Box sx={{marginTop: 2}}>
            <Typography>
                Task ID: {ctx.selectedTaskId}
            </Typography>
            <Typography>
                Tytuł: {task?.title}
            </Typography>
            <Box sx={{marginTop: 1, marginBottom: 1}}>
                <Button sx={{marginRight: 1}} variant="contained" color="primary" onClick={backToList}> Wróć</Button>
                <Button variant="contained" color="error" onClick={deleteTask}> Usuń zadanie</Button>
            </Box>
            <TaskEditComponent task={task} />
        </Box>
    )
}

export default TaskInstanceView