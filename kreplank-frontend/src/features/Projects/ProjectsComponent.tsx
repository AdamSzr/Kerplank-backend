import { Divider } from "@mui/material"
import { useEffect, useState } from "react"
import getProjectsList, { ProjectListResponse } from "../api/download-project-list"

const ProjectsComponent = () => {

    const [projectsList, setProjectList] = useState<undefined | ProjectListResponse>()

    useEffect(() => {
        getProjectsList().then(response => {
            setProjectList(response.data)
            console.log(response.data)
        })

    }, [])



    return <>
        ProjectsComponent

        <Divider />
        {
            projectsList ? JSON.stringify(projectsList) : ""
        }
    </>
}

export default ProjectsComponent