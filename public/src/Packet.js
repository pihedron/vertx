// @ts-check

import Entity from './Entity.js'

export default class Packet {
  /** @type {string} */
  id

  /** @type {Entity} */
  entity

  /**
   * creates a data packet
   * @param {string} id socket id
   * @param {Entity} entity entity position
   */
  constructor(id, entity) {
    this.id = id
    this.entity = entity
  }
}