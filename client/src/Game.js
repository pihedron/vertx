// @ts-check

import { Socket } from 'socket.io-client'
import Player from './Player.js'
import Camera from './Camera.js'
import Vector2 from './Vector2.js'
import Entity from './Entity.js'

export default class Game {
  /** @type {Socket} */
  socket

  /** @type {HTMLCanvasElement} */
  canvas

  /** @type {CanvasRenderingContext2D} */
  ctx

  /** @type {Player} */
  player = new Player()

  /** @type {Camera} */
  camera = new Camera(this.player)

  /**
   * size of tile
   * @constant
   * @type {number}
   */
  size = 64

  /**
   * @param {Socket} socket object for handling multiplayer
   * @param {HTMLCanvasElement} canvas
   */
  constructor(socket, canvas) {
    this.socket = socket
    this.socket.on('init', payload => {
      console.log(`joined server as ${this.socket.id}`)
    })
    this.canvas = canvas

    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('no context available')
    }

    this.ctx = ctx

    this.tick()
  }

  /**
   * offsets a vector relative to the camera
   * @param {Vector2} vec vector to offset
   * @returns position vector relative to camera
   */
  offsetFromCamera(vec) {
    return vec.copy().translate(this.camera.pos.copy().scale(new Vector2(-1, -1))).translate(new Vector2(this.canvas.width / 2, this.canvas.height / 2))
  }

  /**
   * @param {Entity} entity
   */
  drawEntity(entity) {
    const pos = this.offsetFromCamera(entity.pos)
    this.ctx.fillRect(pos.x, pos.y, entity.dim.x, entity.dim.y)
  }

  tick() {
    window.requestAnimationFrame(() => this.tick())

    this.canvas.width = document.body.clientWidth
    this.canvas.height = document.body.clientHeight

    this.camera.follow()

    this.ctx.fillStyle = 'black'
    this.drawEntity(this.player)
  }
}