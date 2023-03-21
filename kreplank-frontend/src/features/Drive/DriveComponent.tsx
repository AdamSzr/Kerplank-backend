import Image from 'next/image'
import React, { DetailedHTMLProps, InputHTMLAttributes, useEffect, useRef, useState } from 'react'
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
    const [mkdirView, setMkdirView] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

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

    const onCreateClick = async () => {
        const path = inputRef.current?.value
        if (path && (path == '' || !path.startsWith('/'))) {
            console.log({ path })
            return
        }
        const createResponse = await directoryMkDir(currentPath + path)
        if (createResponse.status == 201) {
            setDirectoryItems(it => [createResponse.data.item, ...it ?? []])
        }
        console.log(createResponse)



    }
    console.log({ directoryItems })


    const MkdirView = () => {
        return (
            <div>
                <input ref={inputRef} />
                <button onClick={onCreateClick}>utworz</button>
            </div>
        )
    }



    return (
        <div >
            <div>DriveComponent</div>
            <div>acctual path: {currentPath} </div>
            <button onClick={directoryBack}> back </button>
            <button onClick={() => setUploadView(it => !it)} > upload </button>

            <button onClick={() => { setMkdirView(it => !it) }} > create dir </button>
            {uploadView && <UploadFileComponent onUploadSuccess={applyFiles} currentPath={currentPath} />}
            {mkdirView && <MkdirView />}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {directoryItems?.sort((a, b) => a.isDirectory ? -1 : 1)?.map(it => {
                    return <DirectoryItemComponent onDirectoryClickCb={() => { handleDirectoryChange(it.path) }} item={it} />
                })}
            </div>
        </div>
    )
}

export default DriveComponent