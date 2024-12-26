// @ts-check

import { io } from 'socket.io-client'
import Game from './src/Game.js'

const socket = io()

const canvas = document.querySelector('canvas')
if (!canvas) {
  throw new Error('missing canvas')
}

const map = 
`
___________________#
*__________________#
####__######____#=##
#####___________####
####################
`.trim()
const game = new Game(socket, canvas, map)