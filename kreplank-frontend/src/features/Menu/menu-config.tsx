import { ReactNode } from "react"
import UsersComponent from "../Users/UsersComponent"
import SettingsComponent from "../SettingsComponent/SettigsComponent"
import ProjectsComponent from "../Projects/ProjectsComponent"
import ChatComponent from "../Chat/ChatComponent"
import AboutAppView from "../About/AboutAppView"


export type MenuTab = {
  title: string
  view: ReactNode
  name: string
}

export const HomePage = { title:`Strona domowa`, name:`home`, view:<AboutAppView /> } as MenuTab

export class Pages {
  static About = { title:`O aplikacji`, name:`about`, view:<AboutAppView /> } as MenuTab
  static Projects = { title:`Projekty`, name:`projects`, view:<ProjectsComponent /> } as MenuTab
  static Users = { title:`Użytkownicy`, name:`users`, view:<UsersComponent /> } as MenuTab
  static Settings = { title:`Ustawienia`, name:`settigs`, view:<SettingsComponent /> } as MenuTab
  static Chat = { title:`Czat`, name:`chat`, view:<ChatComponent /> } as MenuTab
}
