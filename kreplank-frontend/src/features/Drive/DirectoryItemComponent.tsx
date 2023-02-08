
import Image from 'next/image'
import React from 'react'
import { DirectoryItem } from '../models/DirectoryItem'
import FileIcon from './images/file-image.svg'
import DirectoryIcon from './images/directory-image.svg'
import Link from 'next/link'
import { backendUrlStorage } from '../config'
import { wrap } from 'module'



const DirectoryItemComponent: React.FC<{ item: DirectoryItem, onDirectoryClickCb: () => void }> = ({ item, onDirectoryClickCb }) => {
    const backendUrl = backendUrlStorage.getOrThrow()


    
    const Content = () => {
        return (

            <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', alignItems: 'center', textAlign:'center' }} >
                <Image width={50} height={50} src={item.isFile ? FileIcon.src : DirectoryIcon.src} alt={item.isFile ? "file-icon" : "directory-icon"} />
                <span style={{ width: "90px", wordBreak: 'break-all' }}>
                    {item.name}
                </span>
            </div>

        )
    }


    return (
        item.isFile ? <Link href={`${backendUrl}/api/drive/file?path=${item.path}`} download>
            <Content />
        </Link> : <div onClick={() => onDirectoryClickCb()}>
            <Content />
        </div>
    )
}

export default DirectoryItemComponent


