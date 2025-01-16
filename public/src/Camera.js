// @ts-check

import Entity from './Entity.js'
import Vector2, { UNIT } from './Vector2.js'

export default class Camera {
  /** @type {Vector2} */
  pos = new Vector2(0, 0)

  /** @type {Entity} */
  target

  /**
   * @param {Entity} target
   */
  constructor(target) {
    this.target = target
  }

  follow() {
    const point = this.target.pos.copy().translate(this.target.dim.copy().scale(new Vector2(0.5, 0.5)))
    this.pos.translate(point.translate(this.pos.copy().flip()).scale(UNIT.copy().halve())).round()
  }
}