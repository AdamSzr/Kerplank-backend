

import {Box, Button, Container, Input, Typography} from '@mui/material'
import React, { FormEvent, useContext, useRef, useState } from 'react'
import { ax } from '../api/ax'
import updateProject from '../api/update-project-fetch'
import { uploadMultipleFile } from '../api/upload-file-fetch'
import { Endpoints } from '../config'
import { Project } from '../models/Project'
import { replaceItemInArray } from '../utils/ArrayUtils'
import { ProjectViewContext } from './ProjectsComponent'

const ProjectFileUploadComponent: React.FC<{ project?: Project}> = ({ project }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const ctx = useContext(ProjectViewContext)

    const inputRef = useRef<HTMLFormElement>()


    function onUploadSuccess() {
        console.log(`success`)
    }
    
    const uploadClick: React.FormEventHandler<HTMLFormElement> = async (event) => {

        event.preventDefault()

        const dataForm = new FormData(inputRef.current)
        console.log("FormData size --", dataForm.getAll("files").length)

        dataForm.getAll("files").forEach((it) => {
            console.log((it as File).name)
        })

        const {result,proj} = await uploadMultipleFile(dataForm, `/${project?.id}`).then(it => ({...it,proj:it.project}))

        const idx = ctx.projectList?.findIndex(it => it.id == proj.id)!
        if(result!='ok' || idx<0){
            console.error("Błąd przesyłania pliku")
            return
        }

        console.log(project, `mf`)

        const newProjList = [ctx.projectList!.slice(0,idx), proj, ctx.projectList!.slice(idx+1)]
        ctx.setProjectList( newProjList as Project[] )


        onUploadSuccess()
    }




    return (
        <Container sx={{
            marginTop: 2,
            marginBottom: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            minWidth: 700,
            border: 3,
            borderRadius: 5,
            borderColor: 'primary.main',
            padding: 2
        }}>
       <Typography textAlign={'center'} > Uploading to /{project?.title}</Typography>
            <Box >
                <form
                    ref={inputRef as React.LegacyRef<HTMLFormElement>}
                    onSubmit={uploadClick}
                    method='post' encType="multipart/form-data">
                    <Box >
                        <input type="file" name="files" multiple />
                    </Box>
                    <Box >
                        <Button type='submit'>Submit</Button>
                    </Box>
                </form>
            </Box >
        </Container>
    )
}

export default ProjectFileUploadComponent

