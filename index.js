// @ts-check

import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
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

/**
 * @param {Socket} socket
 * @param {any} ev
 */
function relay(socket, ev) {
  socket.on(ev, payload => socket.broadcast.emit(ev, payload))
}

io.on('connection', socket => {
  console.log(`${socket.id} connected`)
  socket.emit('init')

  socket.on('disconnect', reason => {
    console.log(`${socket.id} disconnected due to ${reason}`)
    socket.broadcast.emit('leave', socket.id)
  })

  relay(socket, 'join') // tell everyone else a new player joined
  relay(socket, 'show') // tell new player everybody else's positions
  relay(socket, 'move') // update player position to other clients
})

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'))
})

server.listen(port, () => {
  console.log(`server online at http://localhost:${port}`)
})