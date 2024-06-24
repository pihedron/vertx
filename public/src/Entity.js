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

  /** @type { 'idle' | 'walk' | 'slide' | 'crouch' | 'jump' } */
  state = 'idle'

  /**
   * @param {number} health
   */
  constructor(health) {
    this.health = health
  }

  /**
   * @param {Vector2} pos position
   * @param {Vector2} dim dimension
   */
  isTouching(pos, dim) {
    return this.pos.x + this.dim.x > pos.x && this.pos.x < pos.x + dim.x && this.pos.y + this.dim.y > pos.y && this.pos.y < pos.y + dim.y
  }
}