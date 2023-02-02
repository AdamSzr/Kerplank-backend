
import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import createChatPost from '../api/create-chat-post-fetch'
import deleteChatPost from '../api/delete-chat-post-fetch'
import downloadChatPosts from '../api/download-chat-post-fetch'
import { userStorage } from '../config'
import { ChatPost } from '../models/ChatPost'
import { formatDate } from '../utils/DataFormater';

const ChatComponent = () => {

  const [posts, setPosts] = useState<ChatPost[] | undefined>(undefined)
  const [text, setText] = useState<string>('')

  useEffect(() => {
    downloadChatPosts().then(response => {
      console.log(response)
      if (response.status === 200) {
        setPosts(response.data.posts)
      }

    })
  }, [])


  const onSendClick = async () => {
    const author = userStorage.tryGet()?.email
    if (text == '' || !author || !posts)
      return

    const response = await createChatPost({ author, content: text })
    console.log(response)
    if (response.status != 200) return

    setPosts([response.data.post, ...posts])
    setText('')
  }


  const onDeletePostClick = async (postId: string) => {
    const response = await deleteChatPost(postId)
    console.log(response)
    if (response.status == 200) {
      const newPostList = posts?.filter(it => it.id != postId) ?? []
      setPosts(newPostList)
    }
  }

  const PostComponent = ({ post }: { post: ChatPost }) => {
    return (
      <Box sx={{ padding: '10px', borderBottom: '1px solid black', display: 'flex', justifyContent: 'space-between' }} >
        <span>
          użytkownik {post.author}
          <br />
          Wiadomość - {post.content}
          <br />
          data: {formatDate(post.created)}
        </span>

        <Button variant='contained' color="error" onClick={() => onDeletePostClick(post.id)}> usuń </Button>
      </Box>
    )
  }


  return (
    <Box>

      <Typography textAlign={'center'} fontSize={'20px'}>
        Witaj na czacie publikowane są najważniejsze informacje. Przeglądaj go co jakiś czas.
      </Typography>
      <Box sx={{
        gap: '20px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <TextField sx={{ minWidth: '40%' }} value={text} onChange={(e) => { setText(e.target.value) }} />
        <Button onClick={onSendClick} variant='contained'  >Wyślij</Button>

      </Box>
      <Box marginTop={"30px"} sx={{ backgroundColor: "#fafafa" }}>
        {posts?.map(it => <PostComponent key={it.created.toString()} post={it} />)}
      </Box>

    </Box>

  )
}

export default ChatComponent