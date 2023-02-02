import { Button } from '@mui/material'
import { NextPage } from 'next'
import { useEffect } from 'react'
import useStorage from '../src/features/hooks/useStorage'


const testStorage = useStorage("testValue")
const testStorage2 = useStorage("toggle", 1)
const TestPage: NextPage = () => {

    useEffect(()=>{
        testStorage.set("napis")
    }, [])
    console.log("test")
    return (
        <div>
            <Button onClick={()=>{
                let value = testStorage2.getOrDefault()
                if (value == 1) {
                    testStorage2.set(0)
                }
                else {
                    testStorage2.set(1)
                }
                testStorage.set("inny napis")
            }}>
                Kliknij mnie

            </Button>
            test
        </div>
    )
}





export default TestPage