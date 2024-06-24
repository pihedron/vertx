// @ts-check

import Vector2 from './Vector2.js'

export default class Packet {
  /** @type {string} */
  id

  /** @type {Vector2} */
  pos

  /**
   * creates a data packet
   * @param {string} id socket id
   * @param {Vector2} pos entity position
   */
  constructor(id, pos) {
    this.id = id
    this.pos = pos
  }
}