import 'semantic-ui-css/semantic.min.css'
import io from 'socket.io-client'
import { useState, useEffect, FormEvent } from 'react'
import { Button, Container, Form, Comment } from 'semantic-ui-react'

type Message = {
  id: string
  author: string
  text: string
}

const socket = io('http://127.0.0.1:5000')

function App() {
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    socket.on('receivedMessage', data => {
      setMessages([...messages, data]);
    })
  }, [messages])  

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Comment.Group style={{ margin: 'auto' }}>
        {messages.map(message => {
          return (
            <Comment key={message.author}>
              <Comment.Content>
                <Comment.Author as='a'>{message.author}</Comment.Author>
                <Comment.Text>
                  {message.text}
                </Comment.Text>
              </Comment.Content>
            </Comment>
          )
        })}

        <Form onSubmit={(e: FormEvent) => {
          e.preventDefault();

          socket.emit('sendMessage', {
            author,
            text,
            id: socket.id,
          });
          setText('')
        }}>
          <Form.Input 
            value={author} 
            placeholder="Type your name" 
            onChange={e => {
              setAuthor(e.target.value)
            }}  
          />
          <Form.TextArea 
            value={text} 
            placeholder="Type here" 
            onChange={e => {
              setText(e.target.value)
            }}  
          />
          <Button 
            type="submit" 
            content="Send" 
            icon="send" 
            primary 
          />
        </Form>
      </Comment.Group>
    </Container>
  )
}

export default App
