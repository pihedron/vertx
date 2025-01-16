// @ts-check

import Vector2 from './Vector2.js'

export default class World {
  /**
   * @type {Record<string, number>}
   */
  indexer = {
    '*': -1,
    '_': 0,
    '#': 1,
    '=': 2,
    '%': 3,
  }

  /**
   * @type {string[]}
   */
  hex = [
    '#08173f',
    '#08173f',
    '#ffd900',
    '#ff2040',
  ]

  /**
   * flattened 2d grid of tiles
   * @type {number[]} 
   */
  grid = []

  /**
   * corner rounding data
   * @type {boolean[][]} 
   */
  corners = []

  /** @type {Vector2} */
  spawn

  /** @type {Vector2} */
  dim

  /**
   * creates an immutable world
   * @param {string} map text representation of map
   */
  constructor(map) {
    const rows = map.split('\n')

    this.dim = new Vector2(rows[0].length, rows.length)

    for (let y = 0; y < rows.length; y++) {
      const row = rows[y]
      const cells = row.split('')
      for (let x = 0; x < cells.length; x++) {
        const cell = cells[x]
        const id = this.indexer[cell]
        this.grid[this.at(x, y)] = id
        this.corners[this.at(x, y)] = []
        if (id < 0) {
          if (id === -1) this.spawn = new Vector2(x, y)
        } else  {
          this.smooth(id, x, y)
        }
      }
    }
  }

  /**
   * get tile using 2d index
   * @param {number} x
   * @param {number} y
   */
  at(x, y) {
    return y * this.dim.x + x
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  read(x, y) {
    if (x < 0 || x >= this.dim.x || y < 0 || y >= this.dim.y) return 0
    return this.grid[this.at(x, y)]
  }

  /**
   * @param {number} id
   */
  isSolid(id) {
    return id > 0
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} i
   */
  sharpen(x, y, i) {
    if (x < 0 || y < 0) return
    this.corners[this.at(x, y)][i] = false
  }

  /**
   * @param {number} id
   * @param {number} x
   * @param {number} y
   */
  smooth(id, x, y) {
    const solid = this.isSolid(id)
    for (let i = 0; i < 4; i++) {
      this.corners[this.at(x, y)][i] = true // all round
    }
    const left = this.read(x - 1, y)
    const up = this.read(x, y - 1)
    if (solid === this.isSolid(left)) {
      this.sharpen(x, y, 0)
      this.sharpen(x, y, 3)
      this.sharpen(x - 1, y, 1)
      this.sharpen(x - 1, y, 2)
    }
    if (solid === this.isSolid(up)) {
      this.sharpen(x, y, 0)
      this.sharpen(x, y, 1)
      this.sharpen(x, y - 1, 2)
      this.sharpen(x, y - 1, 3)
    }
    if (x === this.dim.x - 1 && !solid) {
      this.sharpen(x, y, 1)
      this.sharpen(x, y, 2)
    }
    if (y === this.dim.y - 1 && !solid) {
      this.sharpen(x, y, 2)
      this.sharpen(x, y, 3)
    }
  }
}