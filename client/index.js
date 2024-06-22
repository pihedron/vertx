// @ts-check

import { io } from 'socket.io-client'
import Game from './src/Game.js'

const socket = io('http://localhost:3000/')

const canvas = document.querySelector('canvas')
if (!canvas) {
  throw new Error('missing canvas')
}

const map = 
`
__
##
##
`.trim()
const game = new Game(socket, canvas, map)