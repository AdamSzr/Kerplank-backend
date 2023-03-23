
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Tooltip } from '@mui/material'
import { DirectoryItem } from '../models/DirectoryItem'
import { backendUrlStorage } from '../config'
import FileIcon from './images/file-image.svg'
import DirectoryIcon from './images/directory-image.svg'



const DirectoryItemComponent:React.FC<{ item: DirectoryItem; onDirectoryClickCb: () => void }> = ({ item, onDirectoryClickCb }) => {
  const backendUrl = backendUrlStorage.getOrThrow()

  const [ imageView, setImageView ] = useState()


  // const onOpenHandle = (item:any) => {
  //     console.log(item.target)
  // }

  const Content = () => {
    return (
      <Tooltip open={imageView} onClose={() => setImageView( undefined )} title={<> {item.isFile && <img width={300} height={300} src={backendUrl + `/api/drive/file?path=` + item.path} alt="some img" />} </>}>
        <div style={{ display:`flex`, flexDirection:`column`, padding:`10px`, alignItems:`center`, textAlign:`center` }}>
          <Image width={50} height={50} src={item.isFile ? FileIcon.src : DirectoryIcon.src} alt={item.isFile ? `file-icon` : `directory-icon`} />
          <span style={{ width:`90px`, wordBreak:`break-all` }}>
            {item.name}
          </span>
        </div>
      </Tooltip>

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


