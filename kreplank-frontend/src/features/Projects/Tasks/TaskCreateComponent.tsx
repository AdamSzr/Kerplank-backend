import { Button, Container, TextField, ThemeProvider } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useRef } from 'react'
import createTaskFetch from '../../api/create-task-fetch'
import { ProjectViewContext } from '../ProjectsComponent'
import { createTheme } from "@mui/material/styles";
import { Project } from '../../models/Project'
import { replaceItemInArray } from '../../utils/ArrayUtils'

const TaskCreateComponent = () => {

    const ctx = useContext(ProjectViewContext)

    const taskTitleRef = useRef<HTMLInputElement>(null)
    const taskDescriptionRef = useRef<HTMLInputElement>(null)

    const createTask = async () => {
        const title = taskTitleRef.current?.value

        const description = taskDescriptionRef.current?.value

        if (description && title && ctx.selectedProjectId && ctx.projectList) {
            const response = await createTaskFetch({ description, title, projectId: ctx.selectedProjectId })
            if (response.status == 201) {
                console.log("CREATED")

                ctx.setProjectList(replaceItemInArray(ctx.projectList, response.data.project, (item) => item.id == ctx.selectedProjectId))
                ctx.setViewStage('project-instance')
            }

            console.log({ response })
        } else {
            console.log("missing fields, unable to create task")
        }
    }


    const backToList = () => {
        ctx.setViewStage('project-instance')
    }


    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">

                <Box
                    sx={{
                        border: 3,
                        borderRadius: 5,
                        borderColor: 'warning.main',
                        Width: 420,
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Button sx={{ marginTop: 2 }} variant="contained" color="warning" onClick={backToList}>Wróć do listy</Button>
                    <Box component="form"
                        sx={{
                            width: 350,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: 2,
                        }}
                    >
                        <TextField
                            inputRef={taskTitleRef}
                            margin="normal"
                            fullWidth
                            label="Tytuł"
                            autoFocus
                        />
                        <TextField
                            inputRef={taskDescriptionRef}
                            margin="normal"
                            fullWidth
                            label="Opis"
                            autoFocus
                        />
                        <Button variant="contained" color="warning" onClick={createTask}> Utwórz zadanie</Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default TaskCreateComponent