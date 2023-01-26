import { Box, Button, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import projectDelete from '../../api/delete-project-fetch'
import { Project } from '../../models/Project'
import { Task } from '../../models/Task'
import { replaceItemInArray } from '../../utils/ArrayUtils'
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
        ctx.setViewStage('project-instance')
        ctx.setSelectedTaskId(undefined)
    }

    const deleteTask = async () => {
        console.log({ctx})
        if (!ctx.selectedProjectId || !task) return
        const response = await projectDelete(ctx.selectedProjectId, { taskId: task.id })
        console.log(response)
        if (response.status == 200 && ctx.projectList) {
            console.log("delete task success", task.id)
            ctx.setProjectList(replaceItemInArray(ctx.projectList, response.data.project, (item) => item.id == ctx.selectedProjectId))
            ctx.setViewStage('project-instance')
            ctx.setSelectedTaskId(undefined)
            
        } else {
            console.log("FAILED")
        }
    }


    return (
        <Box sx={{marginTop: 2}}>
            <Typography>
                Tytuł: {task?.title}
            </Typography>
            <Typography>
                Opis: {task?.description}
            </Typography>
            <Typography>
                Przypisany do: {task?.assignedTo}
            </Typography>
            <Typography>
                Status: {task?.status}
            </Typography>
            <Typography>
                Data utworzenia zgłoszenia: {task?.dateTimeCreation}
            </Typography>
            <Typography>
                Przewidywana data zakończenia: {task?.dateTimeCreation}
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