// @ts-check

export default class Vector2 {
  /** @type {number} */
  x

  /** @type {number} */
  y

  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  /**
   * @returns {Vector2}
   */
  copy() {
    return new Vector2(this.x, this.y)
  }

  /**
   * @param {Vector2} vec
   * @returns {Vector2}
   */
  translate(vec) {
    this.x += vec.x
    this.y += vec.y
    return this
  }

  /**
   * @param {Vector2} vec
   * @returns {Vector2}
   */
  scale(vec) {
    this.x *= vec.x
    this.y *= vec.y
    return this
  }

  round() {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
    return this
  }

  floor() {
    this.x = Math.floor(this.x)
    this.y = Math.floor(this.y)
    return this
  }

  ceil() {
    this.x = Math.ceil(this.x)
    this.y = Math.ceil(this.y)
    return this
  }
}