import {Box, Button, ThemeProvider, Container, Typography} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { userStorage } from '../../config'
import { Task } from '../../models/Task'
import { ProjectViewContext } from '../ProjectsComponent'
import {createTheme} from "@mui/material/styles";

const TaskListComponent = () => {

  const ctx = useContext(ProjectViewContext)

  const [taskList, setTaskList] = useState<Task[] | undefined>()
  const [myTasksOnly, setMyTasksOnly] = useState<boolean>(false)


  useEffect(() => {
    if (ctx.projectList) {
      const tasks = ctx.projectList.map(it => it.tasks).flatMap(tasks => tasks)
      setTaskList(tasks)
    }
  }, [ctx.projectList])

  if (!ctx.projectList)
    return <>Poczekaj</>

  console.log(taskList)

  const goToListView = () => {
    ctx.setViewStage('project-list')
  }

  const goToTaskInstanceView = (selectedTaskId: string) => {
    ctx.setViewStage('task-instance')
    ctx.setSelectedTaskId(selectedTaskId)
  }

  const createTaskItemView = (task: Task) => {
    return (
        <Box key={task.id}>
          {task.title}{" "}
          <Button sx={{}} variant="outlined" color="warning" onClick={() => goToTaskInstanceView(task.id)}> Szczegóły </Button>
        </Box>
    )
  }

  const getTaskList = () => {
    const user = userStorage.tryGet()

    if (myTasksOnly && user )
      return taskList?.filter(it => it.assignedTo == user.email)
    else
      return taskList
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
                marginTop: 2,
                padding: 2,

              }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 2,
            }}
            >
              <Button sx={{marginBottom: 1}} variant="contained" color="warning" onClick={goToListView}>Wróć do listy projektów</Button>
              <Button sx={{marginBottom: 1}} variant="contained" color="warning" onClick={() => setMyTasksOnly(state => !state)}> Pokaż moje zadania </Button>
            </Box>
            <Typography fontWeight="bold">Lista zadań</Typography>
            {getTaskList()?.map(task => createTaskItemView(task))}
          </Box>
        </Container>
      </ThemeProvider>
  );
}

export default TaskListComponent