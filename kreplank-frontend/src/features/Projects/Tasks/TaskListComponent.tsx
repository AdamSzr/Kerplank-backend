import { Box, Button, Divider } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Task } from '../../models/Task'
import { ProjectViewContext } from '../ProjectsComponent'

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
    return <Box key={task.id}>
      {task.title}
      <Button onClick={() => goToTaskInstanceView(task.id)}> szczegoly </Button>
    </Box>
  }

  const getTaskList = () => {

    if (myTasksOnly)
      return taskList?.filter(it => it.assignedTo?.email == 'adam.szr98@gmail.com')
    else
      return taskList

  }


  return (
    <Box>
      <div>TasksListComponent</div>
      <Divider />

      <Box>
        {getTaskList()?.map(task => createTaskItemView(task))}
      </Box>

      <Button onClick={() => setMyTasksOnly(state => !state)}> pokaż przypisane do mnie </Button>
      <Box>
        <Button onClick={goToListView}>wroc</Button>
      </Box>

    </Box>
  )
}

export default TaskListComponent