import { Divider } from "@mui/material"
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react"
import getProjectsList, { ProjectListResponse } from "../api/download-project-list"
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { User } from "../models/User";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { Project } from "../models/Project";
import ProjectListComponent from "./ProjectListComponent";
import ProjectCreateComponent from "./ProjectCreateComponent";
import ProjectInstanceComponent from "./ProjectInstanceComponent";
import TaskInstanceView from "./Tasks/TaskInstanceView";
import TaskCreateComponent from "./Tasks/TaskCreateComponent";
import TaskListComponent from "./Tasks/TaskListComponent";


export type ProjectViewStages = "project-create" | "project-list" | "project-instance" | "task-create" | "task-instance" | "task-list"

export type ProjectViewContextType = {
    viewStage: ProjectViewStages,
    setViewStage: Dispatch<SetStateAction<ProjectViewStages>>
    projectList: Project[] | undefined,
    setProjectList: (list: Project[]) => void,
    selectedProjectId: string | undefined,
    setSelectedProjectId: Dispatch<SetStateAction<string | undefined>>
    selectedTaskId: string | undefined,
    setSelectedTaskId: Dispatch<SetStateAction<string | undefined>>
}

export const ProjectViewContext = createContext<ProjectViewContextType>({} as ProjectViewContextType)

const ProjectsComponent = () => {

    const [viewStage, setViewStage] = useState<ProjectViewStages>('project-list')
    const [projectList, setProjectList] = useState<Project[] | undefined>()
    const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>()
    const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>()

    useEffect(() => {
        getProjectsList().then(response => {
            setProjectList(response.data.list)
            // console.log(response.data)
        })

    }, [])

    const contextValue: ProjectViewContextType = {
        viewStage,
        setViewStage,
        projectList,
        setProjectList: (projectList: Project[]) => { setProjectList(projectList ?? []) },
        selectedProjectId,
        setSelectedProjectId,
        selectedTaskId,
        setSelectedTaskId,
    }


    console.log({ viewStage, selectedProjectId, selectedTaskId })


    return (
        <ProjectViewContext.Provider value={contextValue}>
            {viewStage == 'project-list' && <ProjectListComponent />}
            {viewStage == 'project-create' && <ProjectCreateComponent />}
            {viewStage == 'project-instance' && selectedProjectId != undefined && <ProjectInstanceComponent />}
            {viewStage == 'task-instance' && selectedTaskId != undefined && <TaskInstanceView />}
            {viewStage == 'task-create' && selectedProjectId != undefined && <TaskCreateComponent />}
            {viewStage == 'task-list' && <TaskListComponent />}
        </ProjectViewContext.Provider>
    )
}


export default ProjectsComponent