

import { Box, Typography } from '@mui/material'
import React, { FormEvent, useContext, useState } from 'react'
import { ax } from '../api/ax'
import updateProject from '../api/update-project-fetch'
import { Endpoints } from '../config'
import { Project } from '../models/Project'
import { ProjectViewContext } from './ProjectsComponent'

const ProjectFileUploadComponent: React.FC<{ project?: Project}> = ({ project }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const ctx = useContext(ProjectViewContext)



    const onUploadUpdateProject = async () =>{
        if(!project || !selectedFile)
        return

       const response = await updateProject(project.id,{files: [...project.files, selectedFile.name]})
        console.log({response})
        if(response.status==200){
            console.log("File has been added")
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
        <div>
            <Box>
                Dodaj plik
                <form id="form" encType="multipart/form-data" onSubmit={onUploadClick}>
                    <div>
                        <div>
                            <label htmlFor="file">Choose file to upload</label>
                            <input type="file" id="file" name="file" onChange={onSelectedFile} />
                        </div>

                        <button type='submit'> zapisz </ button>
                    </div>
                </form>


            </Box>
            <Box>
                Dodane pliki:
                {selectedFile?.name}
            </Box>
            <Box>
                <Typography>
                    Wszystkie pliki
                </Typography>
                <Box>
                    {project?.files.map(file => <Box key={file}>{file}</Box>)}
                </Box>
            </Box>
        </div>
    )
}

export default ProjectFileUploadComponent