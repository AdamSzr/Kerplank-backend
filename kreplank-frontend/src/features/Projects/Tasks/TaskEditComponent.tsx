import { Box, Button, Divider, MenuItem, Select, TextField, Typography } from '@mui/material'
import { it } from 'node:test'
import React, { useContext, useState } from 'react'
import updateTask, { UpdateTaskRequest } from '../../api/update-task-fetch'
import { userStorage } from '../../config'
import { Task } from '../../models/Task'
import { ProjectViewContext } from '../ProjectsComponent'

const TaskEditComponent: React.FC<{ task?: Task }> = ({ task }) => {

    const ctx = useContext(ProjectViewContext)

    const [request, setRequest] = useState<UpdateTaskRequest>({})


    if (!task) {
        return <>poczekaj</>
    }

    const onUpdateClick = async () => {
        const response = await updateTask(task.id,request)
        console.log({ response,request })
        if (response.status == 201) {
            console.log("Task updated")
            
        }
    }


    const onAssignClick = async () => {
        const user = userStorage.tryGet()
        if (user)
            setRequest(it => ({ ...it, assignedTo: user.email }))
    }

    const updateField = (key: keyof UpdateTaskRequest, value: any) => {
        let update: any = {}
        update[key] = value
        console.log({ old: request[key], key, value, update })

        setRequest(it => ({ ...it, ...update }))

    }

    return (
        <Box>
            <Typography> Modyfikacje </Typography>
            <Divider />
            <Box display={'grid'}>
                <TextField label="tytul" onChange={(e) => updateField('title', e.target.value)} value={request.title ?? task.title} > </TextField>
                <TextField label="opis" onChange={(e) => updateField('description', e.target.value)} value={request.description ?? task.description}> </TextField>
                <TextField label="przypisane do" value={request.assignedTo ?? task.assignedTo } disabled> </TextField>
                {!task.assignedTo && <Button onClick={onAssignClick}>Przypisz do mnie</Button>}
                <TextField label="data utworzenia" onChange={(e) => updateField('dateTimeCreation', e.target.value)} value={request.dateTimeCreation ?? task.dateTimeCreation}> </TextField>
                <TextField label="data zakonczenia" onChange={(e) => updateField('dateTimeDelivery', e.target.value)} value={request.dateTimeDelivery ?? task.dateTimeDelivery}> </TextField>
                <Select
                    value={request.status ?? task.status}
                    label="Age"
                    onChange={(e) => updateField('status', e.target.value)}
                >
                    <MenuItem value={'NEW'}>NOWY</MenuItem>
                    <MenuItem value={'IN_PROGRESS'}>W TRAKCIE</MenuItem>
                    <MenuItem value={'DONE'}>ZAKONCZONE</MenuItem>
                </Select>
            </Box>

            <Divider />
            <Typography> zmiany do zapisania</Typography>
            <pre>
                {JSON.stringify(request, null, 2)}
            </pre>
            <Button onClick={onUpdateClick}>zapisz</Button>
        </Box>
    )
}

export default TaskEditComponent