// @ts-check

import { Socket } from 'socket.io-client'
import Player from './Player.js'
import Camera from './Camera.js'
import Vector2 from './Vector2.js'
import Entity from './Entity.js'
import World from './World.js'
import Packet from './Packet.js'

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
  friction = 0.5

  /** @type {number} */
  gravity = 2

  /** @type {Record<string, boolean>} */
  pressed = {}

  /** @type {number} */
  ticks = 0

  /** @type {Record<string, Entity>} */
  others = {}

  /**
   * @param {Socket} socket object for handling multiplayer
   * @param {HTMLCanvasElement} canvas canvas element
   * @param {string} map text representation of map
   */
  constructor(socket, canvas, map) {
    this.socket = socket
    this.socket.on('init', payload => {
      console.log(`joined server as ${this.socket.id}`)
      socket.emit('join', new Packet(/** @type {string} */ (this.socket.id), this.player))
    })
    this.socket.on('move', (/** @type {Packet} */ packet) => this.moveOtherPlayers(packet))
    this.socket.on('show', (/** @type {Packet} */ packet) => {
      this.others[packet.id] = new Entity(packet.entity.health)
      this.moveOtherPlayers(packet)
    })
    this.socket.on('join', (/** @type {Packet} */ packet) => {
      this.others[packet.id] = new Entity(packet.entity.health)
      this.moveOtherPlayers(packet)
      socket.emit('show', new Packet(/** @type {string} */ (this.socket.id), this.player))
    })
    socket.on('leave', (/** @type {string} */ id) => {
      delete this.others[id]
    })

    this.canvas = canvas

    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('no context available')
    }

    this.ctx = ctx

    this.world = new World(map)
    this.player.pos = this.world.spawn.scale(new Vector2(this.size, this.size))

    window.addEventListener('keydown', ev => this.keydown(ev))
    window.addEventListener('keyup', ev => this.keyup(ev))

    this.tick()
  }

  /**
   * @param {Packet} packet
   */
  moveOtherPlayers(packet) {
    const vec = new Vector2(packet.entity.pos.x, packet.entity.pos.y)
    this.others[packet.id].pos = vec
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
      if (tile <= 0) continue
      this.ctx.fillStyle = '#08173f'
      const pos = this.offsetFromCamera((new Vector2(i % this.world.dim.x, Math.floor(i / this.world.dim.x))).scale(new Vector2(this.size, this.size)))
      this.ctx.fillRect(pos.x, pos.y, this.size, this.size)
    }
  }

  /**
   * @param {KeyboardEvent} ev keyboard event
   */
  keydown(ev) {
    this.pressed[ev.key] = true
  }

  /**
   * @param {KeyboardEvent} ev keyboard event
   */
  keyup(ev) {
    this.pressed[ev.key] = false
  }

  /**
   * handles collisions
   * @param {Entity} entity entity
   * @param {string} axis
   * @returns {void}
   */
  handleCollisions(entity, axis) {
    const bounds = new Vector2(1, 1)
    const middle = entity.pos.copy().scale(new Vector2(1 / this.size, 1 / this.size)).round()
    for (let x = middle.x - bounds.x; x <= middle.x + bounds.x; x++) {
      for (let y = middle.y - bounds.y; y <= middle.y + bounds.y; y++) {
        const tile = this.world.read(x, y)
        if (tile <= 0) continue
        const dim = new Vector2(this.size, this.size)
        const pos = (new Vector2(x, y)).scale(dim)
        if (entity.isTouching(pos, dim)) {
          if (entity.vel[axis] > 0) {
            entity.pos[axis] = pos[axis] - entity.dim[axis]
            if (axis == 'y') {
              entity.isGrounded = true
            }
          }
          if (entity.vel[axis] < 0) {
            entity.pos[axis] = pos[axis] + dim[axis]
          }
          entity.vel[axis] = 0
        }
      }
    }
  }

  tick() {
    window.requestAnimationFrame(() => this.tick())

    const old = this.player.pos.copy()

    this.canvas.width = document.body.clientWidth
    this.canvas.height = document.body.clientHeight

    this.player.vel.y += this.gravity

    if (this.pressed['w'] && this.player.isGrounded) {
      this.player.vel.y = -this.player.jumpPower
    }

    this.player.isGrounded = false
    this.player.pos.y += this.player.vel.y

    this.handleCollisions(this.player, 'y')

    this.player.isCrouching = Boolean(this.pressed['s']) && this.player.isGrounded
    let delta = this.player.movePower

    if (this.player.isCrouching) {
      delta *= this.player.state === 'walk' ? 16 : 0
      this.player.state = 'slide'
    } else {
      this.player.state = 'idle'
    }

    if (this.pressed['d']) {
      this.player.vel.x += delta
    }

    if (this.pressed['a']) {
      this.player.vel.x -= delta
    }

    this.player.pos.x += this.player.vel.x
    this.player.vel.x *= 1 - (this.friction * (1 - Number(this.player.state === 'slide') * 0.5))

    this.handleCollisions(this.player, 'x')

    if (this.player.state !== 'slide' && Math.abs(this.player.vel.x) > 1) {
      this.player.state = 'walk'
    }

    this.player.pos.round()

    this.camera.follow()

    if (old.x !== this.player.pos.x || old.y !== this.player.pos.y) {
      this.socket.emit('move', new Packet(/** @type {string} */ (this.socket.id), this.player))
    }

    this.ctx.fillStyle = '#fc6450'
    for (const entity of Object.values(this.others)) {
      this.drawEntity(entity)
    }

    this.ctx.fillStyle = '#2d5ce1'
    this.drawEntity(this.player)

    this.drawWorld()

    this.ticks++
  }
}