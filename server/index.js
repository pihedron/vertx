// @ts-check

import { Server } from 'socket.io'

const io = new Server(3000, {
  cors: {
    origin: '*'
  }
})

io.on('connection', socket => {
  console.log(socket.handshake.address)
  socket.emit('init')
  socket.on('move', payload => {
    socket.broadcast.emit('move', payload)
  })
})