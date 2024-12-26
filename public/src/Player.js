// @ts-check

import Entity from './Entity.js'

export default class Player extends Entity {
  /** @type {number} */
  movePower = 4

  /** @type {number} */
  jumpPower = 16

  /** @type {boolean} */
  isGrounded = false

  /** @type {boolean} */
  isCrouching = false

  constructor() {
    super(8)
  }
}