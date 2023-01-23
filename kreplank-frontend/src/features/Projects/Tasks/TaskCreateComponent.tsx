import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useRef, useState } from 'react'
import createTaskFetch from '../../api/create-task-fetch'
import { CreateTaskRequestBody } from '../../models/request/CreateTaskRequest'
import { ProjectViewContext } from '../ProjectsComponent'

const TaskCreateComponent = () => {

    const ctx = useContext(ProjectViewContext)

    const taskTitleRef = useRef<HTMLInputElement>(null)
    const taskDescriptionRef = useRef<HTMLInputElement>(null)



    const createTask = async () => {
        const title = taskTitleRef.current?.value

        const description = taskDescriptionRef.current?.value

        if (description && title && ctx.selectedProjectId) {
            const response = await createTaskFetch({ description, title, projectId: ctx.selectedProjectId })
            if (response.status == 201) {
                console.log("CREATED")
            }

            console.log({ response })
        } else {
            console.log("missing fields, unable to create task")
        }
    }


    const backToList = () => {
        ctx.setViewStage('project-instance')
    }


    return (
        <Box>
            TaskCreateComponent
            <Box>
                <TextField label="title" inputRef={taskTitleRef} />
                <TextField label="description" inputRef={taskDescriptionRef} />
                <Button onClick={createTask}>
                    utworz
                </Button>
            </Box>

            <Button onClick={backToList}>
                wroc
            </Button>


        </Box>
    )
}

export default TaskCreateComponent