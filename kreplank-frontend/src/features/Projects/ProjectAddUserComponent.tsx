

import { Box, Button, Divider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import downloadAllUsers from '../api/user-all-fetch'
import { Project } from '../models/Project'
import { User } from '../models/User'
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import updateProject from '../api/update-project-fetch'


const ProjectAddUserComponent: React.FC<{ project?: Project }> = ({ project }) => {
    if (!project) {
        <>Proszę czekać</>
    }

    const [usersInProj, setUsersInProj] = useState<string[]>()
    const [allUsersList, setAllUsersList] = useState<string[]>()

    useEffect(() => {
        if (project) {
            setUsersInProj(project.users)
        }

        downloadAllUsers().then(
            (response) => {
                console.log(response)
                if (response.status == 200) {
                    setAllUsersList(response.data.list.filter(it => it.email != project?.creator).map(it => it.email))
                }
            }
        )

    }, [])



    const onCheckedClicked = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.name
        if (usersInProj?.some(it => it == email)) {
            const newUserList = usersInProj.filter(it => it != email)
            setUsersInProj([...newUserList])
        } else {
            setUsersInProj(list => [...list!!, email])
        }

        console.log(e.target.name)
    }


    const onAddClick = async () => {
        if(!project)
        return

        const response = await updateProject(project.id,{users:usersInProj})
        console.log(response)
        if(response.status==200){
            console.log("Users are added.")
        }
    }



    const generateCheckboxFor = (userEmail: string) => {
        return <FormControlLabel key={userEmail}
            control={
                <Checkbox checked={usersInProj?.some(it => it == userEmail)} onChange={onCheckedClicked} name={userEmail} />
            }
            label={userEmail}
        />

    }


    return (
        <Box>
            <div>ProjectAddUserComponent</div>
            <Box>
                <Typography>
                    Lista użytkowników
                </Typography>
                <ul>
                    {allUsersList?.map(it => <li key={it}>{it}</li>)}
                </ul>


                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                    <FormLabel component="legend">Zaznacz aby dodać lub odznacz aby usunąć</FormLabel>
                    <FormGroup>
                        {allUsersList?.map(email => generateCheckboxFor(email))}
                    </FormGroup>
                </FormControl>
            </Box>

            <Divider />
            <Box>
                Aktualnie w projekcie sa
                <br />
                {usersInProj?.join(" | ")}
            </Box>
            <Button onClick={onAddClick}>
                Zapisz
            </Button>
        </Box>
    )
}

export default ProjectAddUserComponent