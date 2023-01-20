import { Box, Button, Divider } from '@mui/material'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { ax } from '../api/ax'
import projectDelete from '../api/delete-project-fetch'
import { Endpoints } from '../config'
import { Project } from '../models/Project'
import { Task } from '../models/Task'
import { ProjectViewContext } from './ProjectsComponent'

const ProjectInstanceComponent = () => {

    const ctx = useContext(ProjectViewContext)
    const [project, setProject] = useState<Project | undefined>()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    useEffect(() => {
        if (ctx.selectedProjectId) {
            const projectEntity = ctx.projectList?.find(project => project.id == ctx.selectedProjectId)
            if (projectEntity) {
                setProject(projectEntity)
            }
        }
    }, [ctx.selectedProjectId])


    if (!ctx.selectedProjectId)
        return <Box> Ładowanie </Box>


    const deleteTask = async (projectId: string, taskId: string) => {
        if (!project) return

        const response = await projectDelete(projectId, { taskId })
        console.log(response)
        if (response.status == 200) {
            console.log("delete task success", taskId)

        } else {
            console.log("FAILED")
        }
    }

    const deleteProject = async () => {
        if (!project) return

        const response = await projectDelete(project.id)
        if (response.status == 200) {
            console.log("delete project success", project.id)
        } else {
            console.log("FAILED")
            console.log({ response })
        }
    }

    const onBackClick = () => {
        ctx.setSelectedProjectId(undefined)
        ctx.setViewStage('project-list')
    }


    const onDeleteTaskClick = (task: Task) => {
        if (project)
            deleteTask(project.id, task.id)
    }

    const taskItemComponent = (task: Task) => {
        return <Box key={task.id} >
            {task.title}
            <Button onClick={() => onDeleteTaskClick(task)}>delete - task</Button>
        </Box>
    }

    const createTask = () => {
        ctx.setViewStage('task-create')
    }

    const onUploadClick = async (e: FormEvent) => {
        e.preventDefault()
        console.log(e, "submit")
        if (!selectedFile)
            return

        const fd = new FormData(e.currentTarget as HTMLFormElement)
        console.log(fd)
        if (selectedFile && project) {

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
        <Box>
            ProjectInstanceComponent
            <Button onClick={deleteProject}> usun projekt </Button>
            <Button onClick={createTask}>
                utworz zadanie
            </Button>
            <Box>
                Lista tasków
                <Divider />
                {project?.tasks.map(task => taskItemComponent(task))}
            </Box>

            <Button onClick={onBackClick}>wróć</Button>
            <Divider />
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
        </Box>
    )
}

export default ProjectInstanceComponent