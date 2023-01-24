import {Box, Button, Container, Divider, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import updateTask, { UpdateTaskRequest } from '../../api/update-task-fetch'
import { userStorage } from '../../config'
import { Task } from '../../models/Task'
import { ProjectViewContext } from '../ProjectsComponent'
import {createTheme, ThemeProvider} from "@mui/material/styles";

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

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Box
                    sx={{
                        border: 3,
                        borderRadius: 5,
                        borderColor: 'warning.main',
                        marginTop: 2,
                        padding:2,
                        minWidth: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h5" fontWeight="bold">
                        Modyfikacja
                    </Typography>
                    <Box component="form"
                         sx={{
                             display: 'flex',
                             flexDirection: 'column',
                             alignItems: 'center',
                         }}
                    >
                        <TextField
                            sx={{
                                marginTop: 2,
                                minWidth: 350,
                            }}
                            label="Tytuł"
                            onChange={(e) => updateField('title', e.target.value)}
                            value={request.title ?? task.title}>
                        </TextField>
                        <TextField
                            sx={{
                                marginTop: 1,
                                minWidth: 350,
                            }}
                            label="Opis"
                            onChange={(e) => updateField('description', e.target.value)}
                            value={request.description ?? task.description}>
                        </TextField>
                        <TextField
                            sx={{
                                marginTop: 1,
                                minWidth: 350,
                            }}
                            label="Przypisane do"
                            value={request.assignedTo ?? task.assignedTo ?? '' }
                            disabled>
                        </TextField>
                        {!task.assignedTo && <Button onClick={onAssignClick}>Przypisz do mnie</Button>}
                        <TextField
                            sx={{
                                marginTop: 1,
                                minWidth: 350,
                            }}
                            label="Data Utworzenia"
                            onChange={(e) => updateField('dateTimeCreation', e.target.value)}
                            value={request.dateTimeCreation ?? task.dateTimeCreation}>
                        </TextField>
                        <TextField
                            sx={{
                                marginTop: 1,
                                minWidth: 350,
                            }}
                            label="Data zakończenia"
                            onChange={(e) => updateField('dateTimeDelivery', e.target.value)}
                            value={request.dateTimeDelivery ?? task.dateTimeDelivery}>
                        </TextField>
                        <Typography sx={{marginTop: 1}}>Status</Typography>
                        <Select
                            value={request.status ?? task.status}
                            onChange={(e) => updateField('status', e.target.value)}
                        >
                            <MenuItem value={'NEW'}>NOWY</MenuItem>
                            <MenuItem value={'IN_PROGRESS'}>W TRAKCIE</MenuItem>
                            <MenuItem value={'DONE'}>ZAKONCZONE</MenuItem>
                        </Select>
                    </Box>
                    <Divider />
                    <Typography sx={{marginTop: 2}}> Zmiany do zapisania</Typography>
                    <pre>
                        {JSON.stringify(request, null, 2)}
                    </pre>
                    <Button variant="contained" color="primary" onClick={onUpdateClick}>Zapisz</Button>
                </Box>
            </Container>
        </ThemeProvider>
    );

}

export default TaskEditComponent