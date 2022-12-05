import { ReactNode } from "react"
import SettingsComponent from "../HomeComponent/SettigsComponent"
import ProjectsComponent from "../Projects/ProjectsComponent"
import UsersComponent from "../Users/UsersComponent"


export type MenuTab = {
    title: string,
    view: ReactNode,
    name: string
}


export const menuTabs = [
    { title: "O aplikacji", name: "about", view: <ProjectsComponent /> },
    { title: "Projekty", name: "projects", view: <ProjectsComponent /> },
    { title: "Użytkownicy", name: "users", view: <UsersComponent /> },
    { title: "Ustawienia", name: 'settigs', view: <SettingsComponent /> },
] as MenuTab[]