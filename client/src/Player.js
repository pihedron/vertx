// @ts-check

import Entity from './Entity.js'

export default class Player extends Entity {
  /** @type {number} */
  movePower = 4

  /** @type {number} */
  jumpPower = 24

  /** @type {boolean} */
  isGrounded = false

  constructor() {
    super(8)
  }
}