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


export type ProjectViewStages = "project-create" | "project-list"

export type ProjectViewContextType = {
    viewStage: ProjectViewStages,
    setViewStage: Dispatch<SetStateAction<ProjectViewStages>>

}

export const ProjectViewContext = createContext<ProjectViewContextType>({} as ProjectViewContextType)

const ProjectsComponent = () => {

    const [viewStage, setViewStage] = useState<ProjectViewStages>('project-list')


    const contextValue: ProjectViewContextType = {
        viewStage,
        setViewStage
    }

    return (
        <ProjectViewContext.Provider value={contextValue}>
            {viewStage == 'project-list' && <ProjectListComponent />}
            {viewStage == 'project-create' && <ProjectCreateComponent />}
        </ProjectViewContext.Provider>
    )
}


export default ProjectsComponent