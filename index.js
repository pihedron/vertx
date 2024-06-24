// @ts-check

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const app = express()
const server = createServer(app)
const port = process.env.PORT || 3000

const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(express.static(join(__dirname, 'public')))

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', socket => {
  console.log(`${socket.id} connected`)
  
  socket.emit('init')

  socket.on('disconnect', reason => {
    console.log(`${socket.id} disconnected due to ${reason}`)
  })

  socket.on('move', payload => {
    socket.broadcast.emit('move', payload)
  })
})

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'))
})

server.listen(port, () => {
  console.log(`server online at http://localhost:${port}`)
})