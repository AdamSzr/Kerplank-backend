import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import directoryLs from '../api/directory-ls'
import directoryMkDir from '../api/directory-mkdir'
import directoryRootPath from '../api/directory-root-path-fetch'
import { DirectoryItem } from '../models/DirectoryItem'
import DirectoryItemComponent from './DirectoryItemComponent'
import UploadFileComponent from './UploadFileComponent'

const DriveComponent = () => {

    const [currentPath, setCurrentPath] = useState<string>('/')
    const [directoryItems, setDirectoryItems] = useState<null | DirectoryItem[]>()
    const [uploadView, setUploadView] = useState(false)

    useEffect(() => {
        // directoryRootPath().then(it => console.log("directory-root-path", it))
        directoryLs(currentPath).then(it => setDirectoryItems(it.data.items))
        // directoryMkDir(`/adam-${Date.now()}`).then(it => console.log("directory-mkdir", it))
        // <a href  do pliku />
        // upload
    }, [currentPath])


    const handleDirectoryChange = (path: string) => {
        console.log('new path', path)
        setCurrentPath(path)
    }

    const directoryBack = () => {
        const index = currentPath.lastIndexOf("/")

        if (currentPath == '/')
            return

        if (index == 0) {
            setCurrentPath('/')
            return
        }

        setCurrentPath(it => it.substring(0, index))
    }



    const applyFiles = (dirItems: DirectoryItem[]) => {
        console.log(dirItems)
        setDirectoryItems(items => [...items ?? [], ...dirItems])
        setUploadView(false)
    }



    return (
        <div >
            <div>DriveComponent</div>
            <div>acctual path: {currentPath} </div>
            <button onClick={directoryBack}> back </button>
            <button onClick={() => setUploadView(it => !it)} > upload </button>

            <button onClick={() => setUploadView(it => !it)} > create dir </button>
            {uploadView ? <UploadFileComponent onUploadSuccess={applyFiles} currentPath={currentPath} /> : undefined}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {directoryItems?.sort((a, b) => a.isDirectory ? -1 : 1)?.map(it => {
                    return <DirectoryItemComponent onDirectoryClickCb={() => { handleDirectoryChange(it.path) }} item={it} />
                })}
            </div>
        </div>
    )
}

export default DriveComponent