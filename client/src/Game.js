// @ts-check

import { Socket } from 'socket.io-client'
import Player from './Player.js'
import Camera from './Camera.js'
import Vector2 from './Vector2.js'
import Entity from './Entity.js'
import World from './World.js'

export default class Game {
  /** @type {Socket} */
  socket

  /** @type {HTMLCanvasElement} */
  canvas

  /** @type {CanvasRenderingContext2D} */
  ctx

  /** @type {World} */
  world

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

  /** @type {number} */
  friction = 0.25

  /**
   * @param {Socket} socket object for handling multiplayer
   * @param {HTMLCanvasElement} canvas canvas element
   * @param {string} map text representation of map
   */
  constructor(socket, canvas, map) {
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

    this.world = new World(map)

    window.addEventListener('keydown', ev => this.handleControls(ev, this.player))

    this.tick()
  }

  /**
   * offsets a vector relative to the camera
   * @param {Vector2} vec vector to offset
   * @returns {Vector2} position vector relative to camera
   */
  offsetFromCamera(vec) {
    return vec.copy().translate(this.camera.pos.copy().scale(new Vector2(-1, -1))).translate(new Vector2(this.canvas.width / 2, this.canvas.height / 2)).round()
  }

  /**
   * @param {Entity} entity
   */
  drawEntity(entity) {
    const pos = this.offsetFromCamera(entity.pos)
    this.ctx.fillRect(pos.x, pos.y, entity.dim.x, entity.dim.y)
  }

  drawWorld() {
    for (let i = 0; i < this.world.grid.length; i++) {
      const tile = this.world.grid[i]
      if (tile === 0) continue
      this.ctx.fillStyle = 'black'
      const pos = this.offsetFromCamera((new Vector2(i % this.world.dim.x, Math.floor(i / this.world.dim.x))).scale(new Vector2(this.size, this.size)))
      this.ctx.fillRect(pos.x, pos.y, this.size, this.size)
    }
  }

  /**
   * @param {KeyboardEvent} ev keyboard event
   * @param {Player} player reference to player
   */
  handleControls(ev, player) {
    if (ev.key === 'd') {
      player.vel.x += player.movePower
    }
    if (ev.key === 'a') {
      player.vel.x -= player.movePower
    }
  }

  createCollisionArea() {
    const maxVel = new Vector2(this.player.movePower * (1 - this.friction) * Math.E, this.player.jumpPower)
    const bounds = maxVel.copy().scale(new Vector2(1 / this.size, 1 / this.size))
  }

  tick() {
    window.requestAnimationFrame(() => this.tick())

    this.canvas.width = document.body.clientWidth
    this.canvas.height = document.body.clientHeight

    this.player.pos.translate(this.player.vel)
    this.player.vel.x *= 1 - this.friction

    this.camera.follow()

    this.ctx.fillStyle = 'black'
    this.drawEntity(this.player)

    this.drawWorld()
  }
}