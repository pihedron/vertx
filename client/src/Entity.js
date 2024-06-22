// @ts-check

import Vector2 from './Vector2.js'

export default class Entity {
  /** @type {Vector2} */
  pos = new Vector2(0, 0)

  /** @type {Vector2} */
  dim = new Vector2(32, 64)

  /** @type {Vector2} */
  vel = new Vector2(0, 0)

  /** @type {number} */
  health

  /**
   * @param {number} health
   */
  constructor(health) {
    this.health = health
  }
}