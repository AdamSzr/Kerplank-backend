
import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import createChatPost from '../api/create-chat-post-fetch'
import deleteChatPost from '../api/delete-chat-post-fetch'
import downloadChatPosts from '../api/download-chat-post-fetch'
import { userStorage } from '../config'
import { ChatPost } from '../models/ChatMessage'
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


  const handleClick = async (postId: string) => {
    const response = await deleteChatPost(postId)
    console.log(response)
    if (response.status == 200) {
      const newPostList = posts?.filter(it => it.id != postId) ?? []
      setPosts(newPostList)
    }
  }

  const PostComponent = ({ post }: { post: ChatPost }) => {
    return (
      <Box sx={{ padding: '10px', borderBottom: '1px solid', borderColor: 'primary.main', display: 'flex', justifyContent: 'space-between' }} >
        <span>
          <Typography sx={{ fontWeight: 'bold', fontSize: 14 }}> Użytkownik </Typography> {post.author}
          <br />
          Wiadomość - {post.content}
          <br />
          Data: {formatDate(post.created)}
        </span>

        <Button variant='contained' color="error" onClick={() => handleClick(post.id)}> Usuń </Button>
      </Box>
    )
  }


  return (
    <Box sx={{ mt: 2 }}>
      <Typography textAlign={'center'} fontSize={'20px'}>
        Witaj na czacie publikowane są najważniejsze informacje. Przeglądaj go co jakiś czas.
      </Typography>
      <Box sx={{
        gap: '20px',
        display: 'flex',
        justifyContent: 'center',
        mt: 2,
        mb: 2
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



type x = [...[any, any], ...[any, any, any]]['length']