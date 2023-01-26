

import {Box, Container, Typography} from '@mui/material'
import React, { FormEvent, useContext, useState } from 'react'
import { ax } from '../api/ax'
import updateProject from '../api/update-project-fetch'
import { Endpoints } from '../config'
import { Project } from '../models/Project'
import { replaceItemInArray } from '../utils/ArrayUtils'
import { ProjectViewContext } from './ProjectsComponent'

const ProjectFileUploadComponent: React.FC<{ project?: Project}> = ({ project }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const ctx = useContext(ProjectViewContext)



    const onUploadUpdateProject = async () =>{
        if(!project || !selectedFile)
        return

       const response = await updateProject(project.id,{files: [...project.files, selectedFile.name]})
        console.log({response})
        if(response.status==200 && ctx.projectList){
            console.log("File has been added")

            ctx.setProjectList(replaceItemInArray(ctx.projectList, response.data.project, (item) => item.id == ctx.selectedProjectId))
            ctx.setViewStage('project-instance')
        }

    }


    const onUploadClick = async (e: FormEvent) => {
        e.preventDefault()

        console.log(e, "submit")
        if (!selectedFile)
            return

        await onUploadUpdateProject()
        
        return

        const fd = new FormData(e.currentTarget as HTMLFormElement)
        console.log(fd)
        if (selectedFile) {

            const response = await ax(Endpoints['drive.upload'], "POST", fd, undefined) // { "Content-Type": `multipart/form-data;boundary=${selectedFile.size}` }

            // const response = await uploadFile(`/${project.id}`, selectedFile)
            console.log({ response })
        }
        console.log(e, "submit")
    }

    const onSelectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const fileList = event.currentTarget.files
        if (fileList != null && Array.from(fileList).length == 1) {

            const file = fileList[0]
            setSelectedFile(file)
            console.log('selected', file.name)


            // setFiles(event.currentTarget.files );
        }


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
            <Box>
                <Typography fontWeight="bold">Dodaj plik</Typography>
                <form id="form" encType="multipart/form-data" onSubmit={onUploadClick}>

                    <label htmlFor="file">Wybierz plik do dodania </label>
                    <input type="file" id="file" name="file" onChange={onSelectedFile} />
                    <Box sx={{marginTop: 1}}>
                        <button type='submit'> Zapisz </ button>
                    </Box>
                </form>
            </Box>
            <Box sx={{marginTop: 2}}>
                <Typography fontWeight="bold">
                Dodane pliki:
                </Typography>
                {selectedFile?.name}
            </Box>
            <Box sx={{marginTop: 2}}>
                <Typography fontWeight="bold">
                    Wszystkie pliki
                </Typography>
                <Box>
                    {project?.files.map(file => <Box key={file}>{file}</Box>)}
                </Box>
            </Box>
        </Container>
    )
}

export default ProjectFileUploadComponent