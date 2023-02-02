import { Box, Button, TextField, Container, ThemeProvider, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import createProject from '../api/create-project-fetch'
import { CreateProjectRequestBody } from '../models/request/CreateProjectRequest'
import { ProjectViewContext } from './ProjectsComponent'
import { createTheme } from "@mui/material/styles";
import { it } from 'node:test'

function ProjectCreateComponent() {
    const ctx = useContext(ProjectViewContext)

    const [data, setData] = useState<CreateProjectRequestBody>({} as CreateProjectRequestBody)


    const onSubmitClick = async () => {
        let request = { ...data }
        if (!request.dateTimeDelivery || request.dateTimeDelivery == '') {
            const oneMonth = 1000 * 60 * 60 * 24 * 30
            const dateTimeDelivery = new Date(new Date().valueOf() + oneMonth).toISOString()
            request.dateTimeDelivery = dateTimeDelivery
        }

        console.log(request)

        const response = await createProject(request)
        console.log({ response })

        if (response.status == 201) {
            ctx.setProjectList([...ctx.projectList ?? [], response.data.project])
            ctx.setViewStage('project-list')
            ctx.setSelectedProjectId(undefined),
            ctx.setSelectedTaskId(undefined)
        }
    }


    const setValue = (value: string, field: keyof CreateProjectRequestBody) => {
        setData(it => {
            it[field] = value
            return { ...it }
        })
    }

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">

                <Box
                    sx={{
                        border: 3,
                        borderRadius: 5,
                        borderColor: 'success.main',
                        Width: 420,
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Button sx={{ marginTop: 2 }} variant="contained" color="success" onClick={() => { ctx.setViewStage('project-list') }}> lista projektów</Button>
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
                            onChange={(e) => { setValue(e.target.value, 'title') }}
                            margin="normal"
                            fullWidth
                            label="Tytuł"
                            autoFocus
                        />
                        <TextField
                            onChange={(e) => { setValue(e.target.value, 'description') }}
                            margin="normal"
                            fullWidth
                            label="Opis"
                            autoFocus
                        />
                        <Typography sx={{ marginTop: 1 }} component="h1" fontWeight="bold">
                            WYMAGANE jest użycie isoTime dla daty!
                        </Typography>
                        <TextField
                            onChange={(e) => { setValue(e.target.value, 'dateTimeDelivery') }}
                            margin="normal"
                            fullWidth
                            label="Data Dostarczenia"
                            autoFocus
                        />
                        <Button variant="contained" color="success" onClick={onSubmitClick}>Dodaj</Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default ProjectCreateComponent