import { Box, Button, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import createProject from '../api/create-project-fetch'
import { CreateProjectRequestBody } from '../models/request/CreateProjectRequest'
import { ProjectViewContext } from './ProjectsComponent'

function ProjectCreateComponent() {
    const ctx = useContext(ProjectViewContext)

    const [data, setData] = useState<CreateProjectRequestBody>({} as CreateProjectRequestBody)


    const onSubmitClick = async () => {

        console.log(data)

        const response = await createProject(data)
        console.log({response})
    }


    const setValue = (value: string, field: keyof CreateProjectRequestBody) => {
        setData(it => {
            it[field] = value
            return { ...it }
        })
    }



    return (
        <>
            <div>ProjectCreateComponent</div>
            <Button onClick={() => { ctx.setViewStage('project-list') }}> lista projektów</Button>
            <Box>
                <TextField onChange={(e) => { setValue(e.target.value, 'title') }} label="title" />
                <TextField onChange={(e) => { setValue(e.target.value, 'description') }} label="description" />
                <TextField onChange={(e) => { setValue(e.target.value, 'dateTimeDelivery') }} label='dateTimeDelivery' />
            </Box>
            <Button onClick={onSubmitClick} >zapisz</Button>
        </>
    )
}

export default ProjectCreateComponent