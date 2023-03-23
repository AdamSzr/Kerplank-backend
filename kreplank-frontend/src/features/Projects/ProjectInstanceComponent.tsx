import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { Box, Button, Container, Divider,  Grid,  Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { replaceItemInArray } from '../utils/ArrayUtils'
import { Task } from '../models/Task'
import { Project } from '../models/Project'
import { backendUrlStorage } from '../config'
import projectDelete from '../api/delete-project-fetch'
import { ProjectViewContext } from './ProjectsComponent'
import ProjectFileUploadComponent from './ProjectFileUploadComponent'
import ProjectAddUserComponent from './ProjectAddUserComponent'


const ProjectInstanceComponent = () => {

  const ctx = useContext( ProjectViewContext )
  const [ project, setProject ] = useState<Project | undefined>()
  const [ activeView, setActiveView ] = useState<"project-details" | 'add-user' | 'upload-file' | 'file-list' | 'tasks-list'>(`tasks-list`)

  useEffect( () => {
    if (ctx.selectedProjectId) {
      const projectEntity = ctx.projectList?.find( project => project.id == ctx.selectedProjectId )
      if (projectEntity) {
        setProject( projectEntity )
      }
    }
  }, [ ctx.selectedProjectId, ctx.projectList ] )


  if (!ctx.selectedProjectId)
    return <Box> Ładowanie </Box>


  const deleteTask = async(projectId:string, taskId:string) => {
    if (!project) return

    const response = await projectDelete( projectId, { taskId } )
    console.log( response )
    if (response.status == 200 && ctx.projectList) {
      console.log( `delete task success`, taskId )
      console.log( replaceItemInArray( ctx.projectList, response.data.project, item => item.id == projectId ) )
      ctx.setProjectList([ ...replaceItemInArray( ctx.projectList, response.data.project, item => item.id == projectId ) ])
    } else {
      console.log( `FAILED` )
    }
  }

  const deleteProject = async() => {
    if (!project) return

    const response = await projectDelete( project.id )
    if (response.status == 200) {
      console.log( `delete project success`, project.id )

      const newProjectList = ctx.projectList?.filter( it => it.id != project.id ) ?? []
      console.log({ newProjectList })
      ctx.setViewStage( `project-list` )
      ctx.setProjectList( newProjectList )
      ctx.setSelectedProjectId( undefined )
    } else {
      console.log( `FAILED` )
      console.log({ response })
    }
  }

  const onBackClick = () => {
    ctx.setSelectedProjectId( undefined )
    ctx.setViewStage( `project-list` )
  }


  const onDeleteTaskClick = (task:Task) => {
    if (project)
      deleteTask( project.id, task.id )
  }

  const taskItemComponent = (task:Task) => {
    return (<Box
      sx={
        {
          marginTop: 2,
          marginBottom: 2,
          display: `flex`,
          alignItems: `center`,
          minWidth: 700,
        }
      }
      key={task.id}
    >
      <Typography fontWeight="bold" sx={{ marginRight:1, minWidth:`50%` }}>{task.title}</Typography>
      <Button sx={{ marginRight:2 }} variant="contained" onClick={() => { ctx.setSelectedTaskId( task.id ); ctx.setViewStage( `task-instance` ) }}>Szczegóły</Button>
      <Button variant="contained" color="error" onClick={() => onDeleteTaskClick( task )}>Usuń zadanie</Button>
    </Box>)
  }

  const ShowProjectInfo = () => {
    return (
      <Box sx={{ mt:2, mb:2, display:`flex`, flexDirection:`column`, alignItems:`left`, minWidth:800 }}>
        <Typography fontSize="16px"> Autor: {project?.creator}</Typography>
        <Typography fontSize="16px"> Opis: {project?.description}</Typography>
        <Typography fontSize="16px"> Status: {project?.status}</Typography>
        <Typography fontSize="16px"> Data uwtorzenia: {project?.dateTimeCreation}</Typography>
        <Typography fontSize="16px"> Data dostarczenia: {project?.dateTimeDelivery}</Typography>
        <Typography fontSize="16px"> Użytkownicy: {project?.users.join( `, ` )}</Typography>

        <Divider />
        <Button sx={{ marginRight:0 }} variant="contained" color="error" onClick={deleteProject}>
          Usuń projekt
        </Button>
      </Box>
    )
  }

  const ShowTaskList = () => {
    return (
      <Box>
        <Box sx={{ marginBottom:2, marginLeft:2, alignItems:`center`, display:`flex` }}>

        </Box>
        <Box>
          <Typography fontWeight="bold">Lista zadań</Typography>
          <Divider />

          {project?.tasks.map( task => taskItemComponent( task ) )}
        </Box>
      </Box>
    )
  }


  const createTask = () => {
    ctx.setViewStage( `task-create` )
  }

  const onAddUsersClick = () => {
    console.log( `add user clicked` )
    setActiveView( `add-user` )
  }
  const onAddFileClick = () => {
    setActiveView( `upload-file` )
  }

  const showFiles = () => {
    setActiveView( `file-list` )
  }


  const FileListComponent = () => {
    return (<>
      {project?.files.map( file => <div key={file}><Link href={`${backendUrlStorage.tryGet()}/api/drive/file?path=${file}`}>{file}</Link></div> )}
    </>)
  }



  console.log({ activeView })

  return (
    <Container
      sx={
        {
          marginTop: 2,
          marginBottom: 2,
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
          padding: 2,
        }
      }
    >
      <Typography fontSize="30px"> Projekt: {project?.title} </Typography>

      {/* // Informacje.  */}

      <Grid container spacing={2}>
        <Grid item xs={4} display='grid' gap={2}>

          <Button startIcon={<ArrowBackIcon />} sx={{ marginRight:0, marginBottom:`30px` }} variant="contained" color="warning" onClick={onBackClick}>Wróć do listy projektów </Button>
          <Button sx={{ marginRight:0 }} variant="contained" color="success" onClick={createTask} endIcon={<AddCircleIcon />}>
            utworz zadanie
          </Button>
          <Button sx={{ marginRight:0 }} variant="contained" color="primary" onClick={onAddUsersClick} endIcon={<AccountCircleIcon />}>
            dodaj/usun użytkowników
          </Button>
          <Button sx={{ marginRight:0 }} variant="contained" color="primary" onClick={onAddFileClick} endIcon={<CloudUploadIcon />}>
            dodaj plik
          </Button>
          <Button sx={{ marginRight:0 }} onClick={showFiles} variant="contained" color="primary" endIcon={<InsertDriveFileIcon />}>Pokaż pliki </Button>
          <Button sx={{ marginRight:0 }} variant="contained" color="primary" onClick={() => setActiveView( `project-details` )} endIcon={<SettingsIcon />}>
            Informacje i ustawienia
          </Button>

  
        </Grid>

        <Grid item xs={8}>

          {activeView == `tasks-list` && <ShowTaskList />}
          {activeView == `project-details` && <ShowProjectInfo />}
          {activeView == `upload-file` ? <ProjectFileUploadComponent project={project} /> : ``}
          {activeView == `add-user` ? <ProjectAddUserComponent project={project} /> : ``}
          {activeView == `file-list` ? <FileListComponent /> : ``}
        </Grid>
      </Grid>
    </Container>

  )
}

export default ProjectInstanceComponent
